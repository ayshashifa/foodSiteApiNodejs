const uploadFile = require("../middleware/upload.js");
const fs = require("fs");
const baseUrl = "http://localhost:8000/files/";

const tableSchema = require("../schemas/table.schema.js");
const mongo = require("../utils/mongo.js");

const upload = async (req, res) => {
  try {
    const model = mongo.conn.model("tableDetails", tableSchema, "tableDetails");
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const newData = new model({
      fieldName: req.file.originalname, // Assuming originalname is the file name
      // Add other fields as needed
      fileSize: req.file.size, // assuming you want to store the file size
      url: baseUrl + req.file.originalname, 
    });
    await newData.save();
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    const model = mongo.conn.model("tableDetails", tableSchema, "tableDetails");
    // Assuming you want to fetch all documents from the "tableDetails" collection
    const files = await model.find({}, { _id: 0, __v: 0 });
    let fileInfos = files.map((file) => ({
      name: file.fieldName, // Adjust the field name based on your schema
      url: baseUrl + file.fieldName, // Adjust the field name based on your schema
    }));
    res.status(200).send(fileInfos);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Unable to fetch file information from the database!",
    });
  }
};
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

const removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

module.exports = {
  upload,
  getListFiles,
  download,
  remove,
  removeSync,
};
