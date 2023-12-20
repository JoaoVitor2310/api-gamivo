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
3
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
    
    //jay11
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
    //jay11
    
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
      const offset = 100;
      const limit = 100;
    
      try {
        const response = await axios.get(`${url}/api/public/v1/offers?offset=${offset}&limit=${limit}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
    
        const offers = response.data;
        const gameIds = offers.map(offer => offer.product_id);
    
        console.log('Product IDs of available games:', gameIds);
    
        res.json(offers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
})

    app.get('/compareprice/:productId', async (req, res) => {
      try {
        const productId = req.params.productId;
    
        // Obtém a oferta do seu jogo
        const yourOffer = await axios.get(`${url}/api/public/v1/offer/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        // Obtém outras ofertas para o mesmo produto
        const otherOffers = await axios.get(`${url}/api/public/v1/offers?product=${productId}&limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        // Compara os preços
        const yourPrice = yourOffer.data.seller_price;
        const otherPrices = otherOffers.data.map(offer => offer.seller_price);
    
        // Verifica se o seu preço é menor que os outros preços
        const isCheaper = otherPrices.every(price => yourPrice < price);
    
        res.json({ isCheaper, yourPrice, otherPrices });
      } catch (error) {
        console.error('Erro ao comparar preços:', error.message);
        res.status(500).json({ error: 'Erro ao comparar preços.' });
      }
    });


app.post('/create-offer', async (req, res) => {
      try {
        const {
          product, 
          wholesale_mode,     
          seller_price, 
          tier_one_seller_price, 
          tier_two_seller_price, 
          status, 
          keys, // Descrição: O número de chaves (unidades) disponíveis para venda.
          is_preorder, //Descrição: Indica se a oferta é uma pré-encomenda (preorder). Se verdadeiro, significa que a oferta é para um produto que ainda não foi lançado.
        } = req.body;
    
        // Validar se os campos obrigatórios estão presentes
        if (product === undefined || wholesale_mode === undefined) {
          return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        }
    
        // Construir o objeto da oferta com base no esquema
        const newOffer = {
          product, // id do produto
          wholesale_mode, // Valores: 0: Oferta apenas no varejo. 1: Oferta no varejo e atacado.  2: Oferta apenas no atacado.
                          // Descrição: Define o modo de venda da oferta, se é apenas varejo, varejo e atacado, ou apenas atacado.
          seller_price,  // O preço de venda da oferta para o varejo. Deve ser especificado quando o modo atacado for 0 ou 1.
          tier_one_seller_price,  // O preço de venda da oferta para pedidos por atacado (10-99 unidades). Deve ser especificado quando o modo atacado for 1 ou 2.
          tier_two_seller_price, // Descrição: O preço de venda da oferta para pedidos por atacado (100 unidades ou mais). Deve ser especificado quando o modo atacado for 1 ou 2.
          status: status || 1, // Se o status não for fornecido, definir como 1 (ativo) por padrão
          keys: keys || 0, // Se as chaves não forem fornecidas, definir como 0 por padrão
          is_preorder: is_preorder || false, // Se não for fornecido, definir como false por padrão
        };
    
        // Fazer a solicitação POST para a API Gamivo para criar uma nova oferta
        const response = await axios.post(`${url}/api/public/v1/offer/create`, newOffer, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        // Responder com os dados da nova oferta criada
        res.json(response.data);
      } catch (error) {
        console.error('Erro ao criar uma nova oferta:', error.message);
        res.status(500).json({ error: 'Erro ao criar uma nova oferta.' });
      }
    });
    


