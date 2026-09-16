const express = require('express');
const storeRouter = express.Router();
const storeController = require('../controllers/store-controller');

storeRouter.get('/', storeController.getIndex);
storeRouter.get("/home-list", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/fav-list", storeController.getFavHomes);
storeRouter.get("/index", storeController.getIndex);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);

storeRouter.post("/fav-list", storeController.postAddToFavHomes);
storeRouter.post("/fav-list/delete/:homeId", storeController.postDeleteFromFavourites);
storeRouter.get("/house-rules/:homeId", storeController.getHouseRules);


module.exports = storeRouter; 