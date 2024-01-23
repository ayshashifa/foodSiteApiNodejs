const express = require("express");
const router = express.Router();
const newsController = require("../controller/newsControllers");

router.post('/food/news/short',newsController.moreNewsUpload);
router.get('/food/news/short',newsController.getNews);
router.get('/food/news/:news_id', newsController.getNewsId);
router.get("/files/:name", newsController.download);
router.delete("/files/:name", newsController.remove);
module.exports = router;
