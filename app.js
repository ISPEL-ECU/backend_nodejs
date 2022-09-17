const isAuth = require("./middleware/is-react-auth");

const PORT = 3000;

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

var cors = require("cors");

const sequelize = require("./util/database");
const association = require("./util/association");
const routes = require("./util/routes");

const app = express();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext.toLowerCase() !== ".mp4" && ext.toLowerCase() !== ".avi" && ext.toLowerCase() !== ".html" && ext.toLowerCase() !== ".rmd") {
    console.log(ext);
    cb(new Error("Wrong file type"), false);
  } else {
    cb(null, true);
  }
};


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "video/mp4" || file.mimetype === "video/avi") {
      cb(null, "Video");
    } else {
    cb(null, "rmdhtml");
    }
  },
  filename: (req, file, cb) => {
    //if run under Windows - use file.originalname, for the server use construction with Date
    //cb(null, new Date().toISOString() + '-' + file.originalname)
    cb(null, file.originalname);
  },
});



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(
  multer({
    limits: { fieldSize: 500 * 1024 * 1024 },
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    { name: "contentUpload", maxCount: 1 },
    { name: "rmdUpload", maxCount: 1 },
    { name: "assetsUpload" },
  ])
);



app.use(express.static(path.join(__dirname, "public"))); //provide static access to the public folder

app.use(express.static(path.join(__dirname, "build")));
app.use(
  "/author/topic/rmdhtml",
  express.static(path.join(__dirname, "rmdhtml"))
);
app.use(
  "/author/topic/Video",
  express.static(path.join(__dirname, "Video"))
);

routes.define(app);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

//define associations between models (db structure)
association.define();

sequelize
  .sync({ force: false })
  .then((result) => {
    console.log(result);
    console.log(`success. App listening on port: ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log("ERROR!");
    console.log(err);
  });
