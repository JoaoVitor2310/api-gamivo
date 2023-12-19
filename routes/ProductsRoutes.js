const express = require('express');
const router = express.Router();

//Controllers
const {productsList, productIds, compareAll, compareById} = require('../controllers/ProductsController');

//Middlewares

//Routes
router.get('/productsList', productsList);
router.get('/productIds', productIds);
router.get('/compareAll', compareAll);
router.get('/compareById/:id', compareById);



module.exports = router;