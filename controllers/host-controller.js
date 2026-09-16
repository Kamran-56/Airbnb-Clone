const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');

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


// const postAddHome = (req, res, next) => {
//     console.log("BODY: ", req.body, req.body.houseName);
//     console.log("FILE", req.file);
// if (!req.file) {
//     console.log("No file uploaded");
//     return res.status(422).send("No file uploaded");
// }

//     const {
//         houseName,
//         price,
//         location,
//         rating,
//         description
//     } = req.body;

//     const photo = req.files.photo[0];
//     const houseRules = req.files.houseRules[0];
    

//     const home = new Home({
//     houseName,
//     price,
//     location,
//     rating,
//     photo: photo.path,
//     houseRules: houseRules.path,
//     description
// });

//     home.save()
//         .then(() => {
//             console.log("Home added successfully");
            
//             res.redirect('/host/host-homes');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };
const postAddHome = (req, res, next) => {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
        houseName,
        price,
        location,
        rating,
        description
    } = req.body;

    const photo = req.files.photo
        ? req.files.photo[0].path
        : null;

    const houseRules = req.files.houseRules
        ? req.files.houseRules[0].path
        : null;

    const home = new Home({
        houseName,
        price,
        location,
        rating,
        photo,
        houseRules,
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
        description
    } = req.body;

    // Home.findById(homeID)
    //     .then((home) => {

    //         if (!home) {
    //             return res.redirect('/host/host-homes');
    //         }

    //         home.houseName = houseName;
    //         home.price = price;
    //         home.location = location;
    //         home.rating = rating;
    //         home.description = description;

    //         if (req.files.photo) {
    //             home.photo = req.files.photo[0].path;
    //         }

    //         if (req.files.houseRules) {
    //             home.houseRules = req.files.houseRules[0].path;
    //         }

    //         return home.save();
        Home.findById(homeID)
        .then((home) => {

            if (!home) {
                return res.redirect('/host/host-homes');
            }

            // If a new photo was uploaded, delete the old photo
            if (req.files.photo) {

                if (home.photo) {
                    const oldPhotoPath = path.join(rootDir, home.photo);

                    fs.unlink(oldPhotoPath, (err) => {
                        if (err) {
                            console.log("Error deleting old photo:", err);
                        } else {
                            console.log("Old photo deleted");
                        }
                    });
                }

                home.photo = req.files.photo[0].path;
            }

            // If a new house-rules PDF was uploaded, delete the old PDF
            if (req.files.houseRules) {

                if (home.houseRules) {
                    const oldRulesPath = path.join(rootDir, home.houseRules);

                    fs.unlink(oldRulesPath, (err) => {
                        if (err) {
                            console.log("Error deleting old house rules:", err);
                        } else {
                            console.log("Old house rules deleted");
                        }
                    });
                }

                home.houseRules = req.files.houseRules[0].path;
            }
            return home.save();
        })
        .then(() => {
            console.log("Home updated successfully");
            res.redirect('/host/host-homes');
        })
        .catch(err => {
            console.log("Error while updating home", err);
            res.redirect('/host/host-homes');
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

