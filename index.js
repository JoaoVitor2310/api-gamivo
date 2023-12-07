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

app.get('/accountdata', async (req, res) => { //nosso endpoint
      try {
            
            // Faça a consulta à outra API usando Axios ou a biblioteca de sua escolha
            // const response = await axios.get(`${url}/api/public/v1/accounts/data`, {headers});

            const response = await axios.get(`${url}/api/public/v1/accounts/data`, { // url + endpoint + token GAMIVO
                  headers: {
                    'Authorization': `Bearer ${token}`
                  //   'Content-Type': 'application/json',  // Opcional: ajuste conforme necessário
                  },
                });
        
            // Retorne os dados da consulta
            res.json(response.data); // nossa resposta
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
          }
      
      // res.send('Server online');
})