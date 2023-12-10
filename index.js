const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
      res.send('Server online');
})

const port = process.env.PORT;
const url = process.env.URL;
const token = process.env.TOKEN;

app.listen(port, () => {
      console.log(`Listening to port ${port}.`);
})

// Accounts
app.get('/account-data', async (req, res) => { //nosso endpoint
      // Retorna o saldo e o fator de preço
      try {
            // Faça a consulta à outra API usando Axios ou a biblioteca de sua escolha
            const response = await axios.get(`${url}/api/public/v1/accounts/data`, { // url + endpoint + token GAMIVO
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            // Retorne os dados da consulta
            res.json(response.data); // nossa resposta
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
})

app.get('/calculate-final-price', async (req, res) => {
      // Retorna o preço final usando o fator de preço
      const price = 10;
      try {
            const response = await axios.get(`${url}/api/public/v1/accounts/calculate-final-price/${price}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            res.json(response.data); 
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
})

// Offers
app.get('/offer-list', async (req, res) => {
      // Lista os jogos que estão a venda
      const offset = 100; // A partir de qual jogo vai mostrar
      const limit = 100; // Limit por página, acho que não pode ser maior que 100
      try {
            const response = await axios.get(`${url}/api/public/v1/offers?offset=${offset}&limit=${limit}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                        // 'Content-Type': 'application/json',
                  },
            });
            const quantidade = response.data.length;
            console.log(quantidade);
            res.json(response.data);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
})

app.post('/crete-offer', async (req, res) => {
      // Lista os jogos que estão a venda
      try {
            const response = await axios.get(`${url}//api/public/v1/offers`, {
                  headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                  },
            });
            const quantidade = response.data.length;
            console.log(quantidade);
            res.json(response.data);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
})
