const uploadFile = require('../middleware/upload');
const fs = require('fs');
const mongo = require("../utils/mongo.js");
const newsSchema = require('../schemas/news.schema');
const commentSchema =require('../schemas/comment.schema.js');
const baseUrl = "http://localhost:8000/files/";

const getNewsId = async (req, res) => {
    try {
        const model = mongo.conn.model("moreNews", newsSchema, "moreNews");
        const model1 = mongo.conn.model("comments",commentSchema,"comments");
        const newsid = parseInt(req.params.news_id);
        const getcomment =await model1.find({news_id:newsid});
        const getdetails = await model.findOne({ news_id: newsid });
        if (!getdetails) {
            return res.status(404).json({ status: "false", message: "News article not found" });
        }
        // let fileInfos = getdetails.map((file) => ({
        //     news_id: file.news_id,
        //     fileName: file.fileName,
        //     url: baseUrl + file.fileName,
        //     title: file.title,
        //     admin: file.admin,
        //     publishedDate: file.publishedDate,
        //     content: file.content,
        // }));
        // res.status(200).send(fileInfos);
        res.status(200).json({ status: "true", getcomment,getdetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "false",
            message: "Unable to fetch file information from the database!",
        });
    }
};


// getmethod
const getNews = async (req, res) => {
    try {
        const model = mongo.conn.model("moreNews", newsSchema, "moreNews");
        const files = await model.find({}, { _id: 0, __v: 0 });
        let fileInfos = files.map((file) => ({
            news_id: file.news_id,
            fileName: file.fileName,
            url: baseUrl + file.fileName,
            title: file.title,
            admin: file.admin,
            publishedDate: file.publishedDate,
            content: file.content,
        }));
        res.status(200).send(fileInfos);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Unable to fetch file information from the database!",
        });
    }
}
// postmethod news short 
const moreNewsUpload = async (req, res) => {
    try {
        const model = mongo.conn.model("moreNews", newsSchema, "moreNews");
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "please upload  the file" })
        }
        const nextNewsId = await getNextNewsId();

        if (isNaN(nextNewsId)) {
            return res.status(500).send({
                message: "Error generating news_id.",
            });
        }
        const newData = new model({
            news_id: nextNewsId,
            fileName: req.file.originalname,
            url: baseUrl + req.file.originalname,
            title: req.body.title,
            admin: req.body.admin,
            publishedDate: req.body.publishedDate,
            content: req.body.content,
            largeContent:req.body.largeContent,
            innerTitle:req.body.innerTitle,
            recentPosts:req.body.recentPosts,
            tags:req.body.tags,
            comments:req.body.comments,
            
        });
        await newData.save();
        res.status(200).send({
            status: "true", data: newData
            //   message: "Uploaded the file successfully: " + req.file.originalname,
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

// 

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

// submit comment form
const submitcomment =async (req,res)=>{
    try{
        const model = mongo.conn.model("comments",commentSchema,"comments");
        const newcomments = new model(req.body);
       const data = await newcomments.save();
        res.status(200).json({status:true, data,message:"success"})
    }catch{
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

module.exports = {
    moreNewsUpload,
    getNews,
    download,
    remove,
    removeSync,
    getNewsId,
    submitcomment,
}
// generate id
// Function to get the highest existing news_id
const getNextNewsId = async () => {
    try {
        const NewsModel = mongo.conn.model("moreNews", newsSchema, "moreNews");
        const highestNews = await NewsModel.findOne({}, { news_id: 1 }).sort({ news_id: -1 }).exec();
        return highestNews ? highestNews.news_id + 1 : 1;
    } catch (error) {
        console.error("Error generating news_id:", error);
        return NaN; // Return NaN to indicate an error
    }
};
