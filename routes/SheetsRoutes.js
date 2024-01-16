const express = require('express');
const router = express.Router();

//Controllers
const { catchFromSheet, colorsAnalyse} = require('../controllers/SheetsController');

//Middlewares

//Routes
router.get('/catchFromSheet', catchFromSheet);
router.get('/catchFromSheet', colorsAnalyse);

module.exports = router;