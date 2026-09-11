const Home = require("../models/home");

const getAddHome = (req, res, next) => {
    
    res.render('host/edit-home', { 
        pageTitle: 'Add Home',
        activePage: 'add-home',
        insideHeading: 'Add Your Home Here:',
        editing: false,
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType  
        }

    );
};

const getEditHome = (req, res, next) => {
    const homeID = req.params.homeID;
    const editing = req.query.editing ==='true';
    console.log(homeID, editing);

    Home.findById(homeID).then(home => {
        if (!home){
            console.log("home not found for editing");
            return res.redirect("/host/host-homes");
        }
        //console.log(home),
        res.render('host/edit-home', { 
        
        home: home,
        pageTitle: 'edit Home',
        activePage: 'host-home',
        editing: editing,
        insideHeading: 'Edit Home',
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType
        });
    }

    );
}


const postAddHome = (req, res, next) => {
    console.log("home registration successful for: ", req.body, req.body.houseName);
    const {
        houseName,
        price,
        location,
        rating,
        photoUrl,
        description
    } = req.body;

    const home = new Home({
        houseName,
        price,
        location,
        rating,
        photoUrl,
        description
    });

    home.save()
        .then(() => {
            console.log("Home added successfully");
            
            res.redirect('/host/host-homes');
        })
        .catch(err => {
            console.log(err);
        });
};


const postEditHome = (req, res, next) => {
    const {
        homeID,
        houseName,
        price,
        location,
        rating,
        photoUrl,
        description
    } = req.body;

// Go to the database, grab the actual home document that already exists, then change its fields one by one, then save it back."
// Here, home is not something you built — it's the real document Mongoose fetched for you. Because Mongoose already knows this document exists (it has a real _id 
// from the database), when you call home.save(), Mongoose automatically knows: "this already exists, so update it." You didn't have to write that check yourself.
// This is more like: "Go to the database, grab the actual home document that already exists, then change its fields one by one, then save it back."
// Here, home is not something you built — it's the real document Mongoose fetched for you. Because Mongoose already knows this document exists (it has a real _id from the database), 
// when you call home.save(), Mongoose automatically knows: "this already exists, so update it." You didn't have to write that check yourself.
    Home.findById(homeID).then((home) => {
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.photoUrl = photoUrl;
        home.description = description;

        home.save()
    .then((result) => {
        console.log("Home updated successfully", result);
        res.redirect('/host/host-homes');   // now runs only after save completes
    })
    .catch(err => {
        console.log("Error while updating home", err);
        res.redirect('/host/host-homes'); // optional: still redirect, or show error page
    });
    }).catch(err => {
        console.log("Error while finding home for editing", err);
    });
};





const getHostHomes = (req, res, next) => {
    console.log('Home:', Home);              
    console.log('fetchAll:', Home.fetchAll); 
    
    Home.find().then(registeredHomes => {  // we use the find() method to retrieve all homes from the database
                                           // instead of fetchAll() method which was used in the previous version of the Home model..
                                          //you switch to Mongoose, your model automatically gets find(), findById(), updateOne() etc. 
                                          // built in — you don't need to write them yourself anymore.
                                                    
        console.log(registeredHomes);

        res.render('host/host-home-list', {
            registeredHomes,
            pageTitle: 'Your Listed Homes',
            activePage: 'host-homes',
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType
        });
    }
    );
}

exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeID;
    console.log("Came to delete ", homeId);

    Home.findById(homeId)      //Home.findById(homeId) returns a Mongoose Query object, which behaves like a Promise when you call .then() on it.
        .then((home) => {
            if (!home) {
                console.log("Home not found");
                return res.redirect("/host/host-homes");
            }

            return Home.deleteOne({ _id: homeId })
                .then(() => {
                    console.log("Home deleted successfully");
                    res.redirect("/host/host-homes");
                });
        })
        .catch((error) => {
            console.log("Error while deleting", error);
        });
};


exports.getAddHome = getAddHome;
exports.postAddHome = postAddHome;
exports.getHostHomes = getHostHomes;
exports.getEditHome = getEditHome;
exports.postEditHome = postEditHome;

