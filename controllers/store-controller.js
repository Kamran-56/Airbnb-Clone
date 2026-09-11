const Home = require("../models/home");
const User = require("../models/user");

const getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/home-list', {
            registeredHomes,
            pageTitle: 'home-list',
            activePage: 'home-list',
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType

        })
    });
};


const getIndex = (req, res, next) => {
    Home.find().then(registeredHomes => {
         console.log('req.isLoggedIn ', req.isLoggedIn);
         console.log('session value: ', req.session);
         console.log('req.session.isLoggedIn: ', req.session.isLoggedIn);
         console.log('req.isLoggedIn ', req.isLoggedIn);

        console.log(registeredHomes);
       

        res.render('store/index', {
            registeredHomes,
            pageTitle: 'Airbnb Home',
            activePage: 'index',
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType
        });
    });
};


const getBookings = (req, res, next) => {
    res.render('store/bookings', {
        pageTitle: 'My Bookings',
        activePage: 'bookings',
        isLoggedIn:req.isLoggedIn,
        userType: req.session.userType
    });
}



const getFavHomes = async (req, res, next) => {
    // console.log("SESSION:", req.session);
    // console.log("SESSION USER:", req.session.user);
    try {
  const userID = req.session.userId;
      console.log('Fetching favourite homes for user ID:', userID);

    const user = await User.findById(userID).populate('favourites');

        console.log('FavHomes:', user.favourites);

            res.render('store/fav-list', {
                favHomes: user.favourites,
                pageTitle: 'My Favorite Homes',
                activePage: 'fav-list',
                isLoggedIn:req.isLoggedIn,
                userType: req.session.userType
            });
    } catch (err) {
        console.log('Error fetching favourite homes:', err);

    }
}

exports.postAddToFavHomes = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.userId;
    console.log('Adding Home ID to favorites:', homeId, 'for user ID:', userId);
    const user = await User.findById(userId);
    if (!user.favourites.includes(homeId)) {
        user.favourites.push(homeId);
        await user.save();
    }
    res.redirect('/fav-list');
  
};


exports.postDeleteFromFavourites = async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.userId;
    console.log('Deleting Home ID from favorites:', homeId, 'for user ID:', userId);

    const user = await User.findById(userId);
    if (user.favourites.includes(homeId)) {
        // console.log("FAVOURITES ARRAY (IDS):", user.favourites);
        // console.log("FAVOURITES ARRAY (IDS) TO STRING:", user.favourites.map(id => id.toString()));
        user.favourites = user.favourites.filter(id => id.toString() !== homeId);
        await user.save();
        console.log('Home removed from favorites:', homeId);
    }
    res.redirect('/fav-list');
};



exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    console.log('Requested Home ID:', homeId);
    Home.findById(homeId).then((home) => {
        if (!home) {
            console.log('Home not found');
            res.redirect('/home-list'); // Redirect to home page if home not found
        }

        else {
            res.render('store/home-detail', {
                home: home,
                homeId,
                pageTitle: 'Home Details',
                activePage: 'home-list',
                isLoggedIn: req.isLoggedIn,
                userType: req.session.userType
            });
        }
    });
}



exports.getHomes = getHomes;
exports.getBookings = getBookings;
exports.getFavHomes = getFavHomes;
exports.getIndex = getIndex;





