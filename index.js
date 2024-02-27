const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const router = require('./routes/Router');
const app = express();
app.use(express.json());


app.get('/', (req, res) => {
      res.send('Server online');
})

cron.schedule('0 */4 * * *', async () => { // Iremos colocar a api para atualizar os preços a cada 4 horas(cliente pediu)
      try {
          const response = await axios.get('http://localhost:3000/api/jobs/attPrices');
          console.log('Endpoint chamado com sucesso');
      } catch (error) {
          console.error('Erro ao chamar o endpoint:', error);
      }
  }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
  });

const port = process.env.PORT;

app.use('/', router);

app.listen(port, () => {
      console.log(`Listening to port ${port}.`);
})