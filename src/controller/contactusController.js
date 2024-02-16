const ContactUsSchema = require("../schemas/contactus.schema");
const mongo = require("../utils/mongo")

const getContactList = async (req, res) => {
    try {
        const Model = mongo.conn.model("contactUs", ContactUsSchema, "contactUs");
        const getdatas = await Model.find({},{},{sort:{user_id:-1}});
        res.status(200).json({ status: true, getdatas })
    } catch(err) {
        console.error(err)
        res.status(500).json({status:false,message:"invalid error"})
    }
}


const postContactList = async (req, res) => {
    try {
        const model = mongo.conn.model("contactUs", ContactUsSchema, "contactUs");
        const newData = new model(req.body);
        newData.user_id = 2000 + await model.countDocuments();
        await newData.save();
        res.status(201).json({ status: true, data: newData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }

}
module.exports = {
    getContactList,
    postContactList

}

