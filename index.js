const express = require('express');
const axios = require('axios');
// const { default: slugify } = require('slugify');
require('dotenv').config();

const router = require('./routes/Router');
const app = express();
app.use(express.json());


app.get('/', (req, res) => {
      res.send('Server online');
})

const port = process.env.PORT;
const url = process.env.URL;
const token = process.env.TOKEN;

app.use('/', router);

app.listen(port, () => {
      console.log(`Listening to port ${port}.`);
})