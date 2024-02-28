const uploadFile = require('../middleware/upload');
const fs = require('fs');
const mongo = require("../utils/mongo.js");
const shopSchema = require('../schemas/shop.schema');

const baseUrl = "http://localhost:8000/files/";

// post shop items
const listOfItems = async (req, res) => {
    try {
        const model = mongo.conn.model("shoplist", shopSchema, "shoplist");
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "please upload  the file" })
        }
        const shopId = await generateShopId();
        const newData = new model({
            shop_id: shopId,
            fileName: req.file.originalname,
            imagePath: baseUrl + req.file.originalname,
            name: req.body.name,
            price: req.body.price,
            largetitle: req.body.largetitle,
            content: req.body.content,
        });
        await newData.save();
        res.status(200).send({ status: "true", data: newData });
    } catch (err) {
        console.log(err);
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({ status: false, message: "File size cannot be larger than 2MB!" });
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};
// get shop list
const getShopList = async (req, res) => {
    try {
        const model = mongo.conn.model("shoplist", shopSchema, "shoplist");
        const page = parseInt(req.params.page) || 1;
        const pagesize = parseInt(req.params.pagesize) || 9;
        const skip = (page - 1) * pagesize;
        const datas = await model.find({},{ _id: 0, _v: 0 }).skip(skip).limit(pagesize).sort({_id:-1});
        res.status(200).send({ status: true, datas })
    } catch {
        res.status(500).send({ status: false, message: "Unable to fetch file information" })
    }
}
// get shop list id wise
const getShopListId = async (req, res) => {
    try {
        const model = mongo.conn.model("shoplist", shopSchema, "shoplist");
        const shopId = parseInt(req.params.shop_id);
        const datas = await model.findOne({ shop_id: shopId });
        res.status(200).send({ status: true, datas })
    } catch {
        res.status(500).send({status:false,message:"unable to find data"});

    }
}
// search
const getShopListsearch = async (req, res) => {
    try {
        const model = mongo.conn.model("shoplist", shopSchema, "shoplist");
        var {name} = req.query;
        name ? (name={$regex:name,$options:'i'}):null 
        // const shopId = parseInt(req.params.shop_id);
        const datas = await model.find({name});
        res.status(200).send({ status: true, datas })
    } catch {
        res.status(500).send({status:false,message:"unable to find data"});

    }
}

// add to cart

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
    download,
    remove,
    removeSync,
    listOfItems,
    getShopList,
    getShopListId,
    getShopListsearch
}
// shopId
const generateShopId = async () => {
    const model = mongo.conn.model("shoplist", shopSchema, "shoplist");
    const latestShop = await model.findOne({}, {}, { sort: { shop_id: -1 } });
    const counter = latestShop ? parseInt(latestShop.shop_id, 10) + 1 : 100;
    return counter
    // .toString().padStart(3, '0');
};
