const express = require('express');
const router = express.Router();

//Controllers
const { catchFromSheet} = require('../controllers/SheetsController');

//Middlewares

//Routes
router.get('/catchFromSheet', catchFromSheet);




module.exports = router;