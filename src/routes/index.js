const express = require("express");
const router = express.Router();
const newsController = require("../controller/newsControllers");
const shopController = require("../controller/shopController");
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

module.exports = router;





























// router.get("/files/:name", shopController.download);
// router.delete("/files/:name", shopController.remove);