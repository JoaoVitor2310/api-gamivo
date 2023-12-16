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

// Accounts
// app.get('/account-data', async (req, res) => { //nosso endpoint
//       // Retorna o saldo e o fator de preço
//       try {
//             // Faça a consulta à outra API usando Axios ou a biblioteca de sua escolha
//             const response = await axios.get(`${url}/api/public/v1/accounts/data`, { // url + endpoint + token GAMIVO
//                   headers: {
//                         'Authorization': `Bearer ${token}`
//                   },
//             });
//             // Retorne os dados da consulta
//             res.json(response.data); // nossa resposta
//       } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao consultar a API externa.' });
//       }
// })

// app.get('/calculate-final-price', async (req, res) => {
//       // Retorna o preço final usando o fator de preço
//       const price = 10;
//       try {
//             const response = await axios.get(`${url}/api/public/v1/accounts/calculate-final-price/${price}`, {
//                   headers: {
//                         'Authorization': `Bearer ${token}`
//                   },
//             });
//             res.json(response.data);
//       } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Erro ao consultar a API externa.' });
//       }
// })