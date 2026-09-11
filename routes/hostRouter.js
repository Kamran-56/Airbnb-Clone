const express = require('express');
const homesController = require('../controllers/host-controller');
const hostRouter  = express.Router();


hostRouter.get("/add-home", homesController.getAddHome);

hostRouter.post("/add-home", homesController.postAddHome);

hostRouter.get("/host-homes", homesController.getHostHomes);

hostRouter.get("/edit-home/:homeID", homesController.getEditHome);

hostRouter.post("/edit-home", homesController.postEditHome); 

hostRouter.post("/delete-home/:homeID", homesController.postDeleteHome);

module.exports = {
    hostRouter
};

