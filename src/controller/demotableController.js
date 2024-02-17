const tableSchema = require("../schemas/table.schema.js");

const mongo = require("../utils/mongo.js")

const getdetails = async (req, res) => {
    try {
        const model = mongo.conn.model("tableDetails", tableSchema, "tableDetails");
        const records = await model.find();
        res.status(200).json({ status: true, data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}
const postdetails = async (req, res) => {
    try {
        const model = mongo.conn.model("tableDetails", tableSchema, "tableDetails");
        const newRecord = new model(req.body);
        await newRecord.save();
        res.status(201).json({ status: true, data: newRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}
const putdetails = async (req, res) => {
    try {
        const model = mongo.conn.model("tableDetails", tableSchema, "tableDetails");
        const recordId = req.params.id;
        const updatedRecord = await model.findOneAndUpdate(
            { _id: recordId },
            { $set: req.body },
            { new: true }
        );
        if (!updatedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ status: true, updatedRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}
const deletedetail = async (req, res)=>{
    try {
        const model = mongo.conn.model("tableDetails", tableSchema, "tableDetails");

        const deleteid = req.params.id;
        const detletedata = await model.findByIdAndDelete({ _id: deleteid });
        if (!detletedata) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ status: true, detletedata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}
module.exports = {
    getdetails,
    postdetails,
    putdetails,
    deletedetail,
   
} 

// 1.	findById
// 2.	findOne
// 3.	findOneAndUpdate
// 4.	updateOne
// 5.	updateMany
// 6.	findByIdAndUpdate
// 7.	findByIdAndDelete
// 8.	deleteOne
// 9.	deleteMany
