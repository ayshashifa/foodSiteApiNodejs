const express = require("express");
const router = express.Router();
const newsController = require("../controller/newsControllers");
const shopController = require("../controller/shopController");
const contactUsController = require("../controller/contactusController");
const authController =require("../controller/authController");
// news page
router.post('/food/news/short', newsController.moreNewsUpload);
router.get('/food/news/short', newsController.getNews);
router.get('/food/news/:news_id', newsController.getNewsId);
router.post("/food/news/comments", newsController.submitcomment);
router.get("/files/:name", shopController.download);
// router.delete("/files/:name", shopController.remove);
// end news page
// shopPage
router.post("/food/shop/list", shopController.listOfItems);
router.get("/food/shop/list",shopController.getShopList);
router.get("/food/shop/:shop_id",shopController.getShopListId);
// contactus
router.post("/food/contactUs",contactUsController.postContactList);
router.get("/food/contactUs",contactUsController.getContactList);
// auth
router.post("/signup",authController.singup)
router.post("/login",authController.login)
router.post("/verifyOtp",authController.verifiotp)
router.get("/getUserDetail",authController.getUserDetail)

router.get("/userdata/:user_id",authController.getUserdata)
router.get("/search",shopController.getShopListsearch)
module.exports = router;





























// router.get("/files/:name", shopController.download);
// router.delete("/files/:name", shopController.remove);