const isAuth = require('./middleware/is-react-auth');

const PORT = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
var session = require('express-session');

var cors = require('cors')




// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);



const sequelize = require('./util/database');
const association = require('./util/association');
const routes = require('./util/routes');

const errorController = require('./controllers/error');



const app = express();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext.toLowerCase() !== '.html' && ext.toLowerCase() !== '.rmd') {
    console.log(ext);
    cb(new Error('Wronf file type'), false)
  } else {
    cb(null, true);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'rmdhtml');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
app.use(multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
  storage: fileStorage,
  fileFilter: fileFilter
}).fields([{ name: 'contentUpload', maxCount: 1 }, { name: 'rmdUpload', maxCount: 1}, { name: 'assetsUpload'}]));
app.use(express.static(path.join(__dirname, 'public'))); //provide static access to the public folder
app.use(express.static(path.join(__dirname, 'build')));
app.use('/author/topic/rmdhtml', express.static(path.join(__dirname, 'rmdhtml')));

app.use(session({
  secret: 'ecusessionsecret',
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false, saveUninitialized: false
}));

routes.define(app);
app.get('*',  (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))});




//define associations between models (db structure)
association.define();



sequelize.sync({ force: false}).then(result => {
  console.log(result);
  console.log(`success. App listening on port: ${PORT}`);
  app.listen(PORT);
}).catch(err => {
  console.log('ERROR!');
  console.log(err);
});


