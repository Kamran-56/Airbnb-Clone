
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require('path');

// external module
const express = require('express');
const app = express();
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);  //we pass the session module to connect-mongodb-session to create a MongoDB session store
const multer = require('multer');
const DB_Path = "mongodb+srv://sheikhkamran1845_db_user:tOhTVllO543q44nZ@mydb.cvdqych.mongodb.net/airbnb_2?appName=MyDB";

 

//local module:
const rootDir = require('./utils/pathUtil');
const storeRouter = require('./routes/storeRouter');
const authRouter = require('./routes/authRouter');
const { hostRouter } = require('./routes/hostRouter');
const errorsController = require('./controllers/errors');

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

const store = new MongoDBStore({
    uri: DB_Path,
    collection: 'sessions'
}); 


const randomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (file.fieldname === 'photo') {
            cb(null, 'uploads/');
        } else if (file.fieldname === 'houseRules') {
            cb(null, 'rules/');
        }
    },

    filename: (req, file, cb) => {
        cb(null, randomString(10) + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.fieldname === 'photo') {

        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }

    } else if (file.fieldname === 'houseRules') {

        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
        }

    } else {
        cb(null, false);
    }
};

const multerOptions = {
    storage,
    fileFilter
};

app.use(express.urlencoded());
app.use(multer(multerOptions).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'houseRules', maxCount: 1 }
]));// for parsing multipart/form-data, which is used for uploading files

app.use(express.static(path.join(rootDir, 'public')));   //app.use('URL PREFIX', 'PHYSICAL FOLDER');  //serving for root url '/' which is by default, so no need to specify it.  This is for serving static files like CSS, JS, images, etc. from the public folder.
app.use('/uploads', express.static(path.join(rootDir, 'uploads'))); // serve static files from the uploads directory
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/homes/uploads', express.static(path.join(rootDir, 'uploads')));

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})



app.use(session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    //console.log("cookies check middleware:", req.get('Cookie')); 
    // req.isLoggedIn = req.get('Cookie') ? req.get('Cookie').split('=')[1] === 'true' : false; // used with cookies, but not for sessions
    req.isLoggedIn = req.session.isLoggedIn; // used with sessions
    next();
});

app.use(authRouter); 

app.use(storeRouter);  

app.use("/host", (req, res, next) => {
    if(!req.isLoggedIn){
        return res.redirect("/login");
    }
    next();
});

app.use('/host', hostRouter);

app.use(errorsController.errorPage);


const PORT = 3000;
mongoose.connect(DB_Path)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`server is running at:http://localhost:${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // ← add this so the crash is obvious
    });
