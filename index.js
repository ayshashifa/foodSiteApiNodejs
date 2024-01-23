const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes");
const cors = require("cors");
const multer = require("multer");
const path = require("path")
const app = express();
global.__basedir = __dirname;
// var whitelist = ['http://localhost:3000',"http://a4f506a.online-server.cloud","http://127.0.0.1:8000","https://inspection1.proz.in"]
var whitelist = ['http://localhost:4200','http://localhost:3000','http://localhost:50004']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1||origin===undefined) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(
  cors(corsOptions)
);
app.use(bodyParser.json());
app.use("/", routes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
