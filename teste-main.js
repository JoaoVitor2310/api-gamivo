const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const url = process.env.URL;
const token = process.env.TOKEN;

app.get('/', (req, res) => {
  res.send('Server online');
});

app.get('/accountdata', async (req, res) => {
  try {
    const accountDataResponse = await axios.get(`${url}/api/public/v1/accounts/data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    res.json(accountDataResponse.data);
  } catch (error) {
    console.error('Erro ao consultar a API externa (accountdata):', error.message);
    res.status(500).json({ error: 'Erro ao consultar a API externa (accountdata).' });
  }
});

app.get('/offerlist', async (req, res) => { 
  try {
    console.log('Recebida requisição para /offerlist');

    const offerListResponse = await axios.get(`${url}/api/public/v1/offer/list`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(offerListResponse);

    // console.log('Resposta da API Gamivo:', offerListResponse.data);
    // console.log('Status da resposta da API Gamivo:', offerListResponse.status);

    // const offerList = offerListResponse.data.map(offer => {
    //   return {
    //     id: offer.id,
    //     product_id: offer.product_id,
    //     product_name: offer.product_name,
    //     seller_name: offer.seller_name,
    //     completed_orders: offer.completed_orders,
    //     rating: offer.rating,
    //     retail_price: offer.retail_price,
    //     wholesale_price_tier_one: offer.wholesale_price_tier_one,
    //     wholesale_price_tier_two: offer.wholesale_price_tier_two,
    //     stock_available: offer.stock_available,
    //     invoicable: offer.invoicable,
    //     status: offer.status,
    //     wholesale_mode: offer.wholesale_mode,
    //     is_preorder: offer.is_preorder,
    //     seller_price: offer.seller_price,
    //     wholesale_seller_price_tier_one: offer.wholesale_seller_price_tier_one,
    //     wholesale_seller_price_tier_two: offer.wholesale_seller_price_tier_two,
    //     provider_product_id: offer.provider_product_id,
    //   };
    // });

    res.json(offerListResponse);
  } catch (error) {
    console.error('Erro ao consultar a lista de ofertas:', error.message);
    console.error('Detalhes do erro:', error.response ? error.response.data : 'Nenhum detalhe disponível');
    res.status(500).json({ error: 'Erro ao consultar a lista de ofertas.' });
  }
});
app.listen(port, () => {
  console.log(`Listening to port ${port}.`);
});
