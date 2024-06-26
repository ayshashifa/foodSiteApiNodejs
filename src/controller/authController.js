const mongo = require("../utils/mongo.js");
const authSchema = require("../schemas/auth.schema.js");
const loginSchema = require("../schemas/login.schema.js");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME, // Use environment variables for email and password
        pass: process.env.EMAIL_PASSWORD
    }
});

const singup = async (req, res) => {
    try {
        const User = mongo.conn.model("singup", authSchema, "singup");
        const { name, email, phone, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }
        // Generate a unique user_id
        const userId = await generateUniqueUserId();
        const newUser = new User({ user_id: userId, name, email, phone, password });
        await newUser.save();
        res.status(200).json({ status: true, message: 'Success', newUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
const login = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required.');
    }
    // Generate OTP
    const otp = generateOTP();

    try {
        // Check if the email is already signed up
        const UserModel = mongo.conn.model("singup", authSchema, "singup");
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: 'Email is not registered. Please sign up first.' });
        }

        // Save email and OTP to the database
        const LoginModel = mongo.conn.model("login", loginSchema, "login");
        const data = await LoginModel.findOneAndUpdate({ email }, { otp }, { upsert: true });

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for login is: ${otp}`
        });

        res.status(200).json({ status: 'true', data, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ status: 'false', message: 'Error sending OTP' });
    }
}

const JWT_SECRET = 'mysecretkey';
const verifiotp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const User = mongo.conn.model("login", loginSchema, "login");
        // Find the user by email and OTP
        const user = await User.findOne({ email, otp });
        if (!user) {
            return res.status(400).send('Invalid OTP');
        }
        // If OTP is valid, generate a JWT and send it as a response
        const payload = { email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
        res.status(200).json({status:true, message: 'OTP verified successfully', token });

        // Clear the OTP from the database
        await User.findOneAndUpdate({ email }, { otp: null });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Error verifying OTP');
    }
};

const getUserDetail = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log("Token verified successfully");
        const UserModel = mongo.conn.model("singup", authSchema, "singup");
        const data = await UserModel.findOne({ email: decoded.email });
        if (!data) {
            return req.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ status: true, data });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// const getUserdata = async (req, res) => {
//     try {
//         const model = mongo.conn.model("singup", authSchema, "singup");
//         const userid = parseInt(req.params.user_id);
//         console.log("user_id",userid)
//         const data = await model.findOne({user_id: userid });
//         res.status(200).json({ status: true, message: "Data found", data: data })
//     } catch {
//         res.status(400).json({ status: false, message: 'No Data Found' })
//     }
// }


// user id generate
const generateUniqueUserId = async () => {
    const model = mongo.conn.model("singup", authSchema, "singup");
    const latestUser = await model.findOne({}, {}, { sort: { user_id: -1 } });
    const counter = latestUser ? parseInt(latestUser.user_id, 10) + 1 : 100;
    return counter;
};
function generateOTP() {
    let otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString().substring(0, 6);
}
module.exports = {
    singup,
    login,
    verifiotp,
    getUserDetail,
    // getUserdata
};
