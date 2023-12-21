const express = require('express');
const router = express.Router();


//Controllers
const {offerList, createOffer, searchOfferById} = require('../controllers/OffersController');

//Middlewares

//Routes
router.get('/offersList', offerList);
router.post('/createOffer', createOffer);
router.get('/search/:id', searchOfferById);
// router.get('/offerList', offerList);



module.exports = router;