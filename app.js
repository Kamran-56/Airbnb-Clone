

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require('path');

// external module
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);  //we pass the session module to connect-mongodb-session to create a MongoDB session store
const DB_Path = "URL";
 

//local module:
const rootDir = require('./utils/pathUtil');
const storeRouter = require('./routes/storeRouter');
const authRouter = require('./routes/authRouter');
const { hostRouter } = require('./routes/hostRouter');
const errorsController = require('./controllers/errors');
const { default: mongoose } = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

const store = new MongoDBStore({
    uri: DB_Path,
    collection: 'sessions'
}); 

app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})

app.use(express.urlencoded());

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
