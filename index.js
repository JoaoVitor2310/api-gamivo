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
      // Coloca um jogo a venda

      try {
            const {
              product, 
              wholesale_mode,     
              seller_price, 
              tier_one_seller_price, 
              tier_two_seller_price, 
              status, 
              keys, // número de chaves (unidades) disponíveis para venda.
              is_preorder, //Indica se é preorder. Se verdadeiro, significa que a oferta é para um produto que ainda não foi lançado.
            } = req.body;
        
            // Validar se os campos obrigatórios estão presentes
            if (product === undefined || wholesale_mode === undefined) {
              return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
            }
        
            // Construir o objeto da oferta com base no esquema
            const newOffer = {
              product, // id do produto
              wholesale_mode, // 0: Oferta apenas no varejo. 1: Oferta no varejo e atacado.  2: Oferta apenas no atacado.
              seller_price,  // O preço de venda para varejo. Deve ser especificado quando o modo atacado for 0 ou 1.
              tier_one_seller_price,  // O preço de venda para pedidos por atacado (10-99 unidades). Deve ser especificado quando o modo atacado for 1 ou 2.
              tier_two_seller_price, // O preço de venda para pedidos por atacado (100 unidades ou mais). Deve ser especificado quando o modo atacado for 1 ou 2.
              status: status || 1, // Se o status não for fornecido, definir como 1 (ativo) por padrão
              keys: keys || 0, // Se as chaves não forem fornecidas, definir como 0 por padrão
              is_preorder: is_preorder || false, // Se não for fornecido, definir como false por padrão
            };
        
            // Fazer a solicitação POST para a API Gamivo para criar uma nova oferta
            const response = await axios.post(`${url}/api/public/v1/offers`, newOffer, {
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
})

app.put('/?', async (req, res) => {
      // Conecta a gamivo com o produto externo

      try {
            const {
              product, 
              wholesale_mode,     
              seller_price, 
              tier_one_seller_price, 
              tier_two_seller_price, 
              status, 
              keys, // número de chaves (unidades) disponíveis para venda.
              is_preorder, //Indica se é preorder. Se verdadeiro, significa que a oferta é para um produto que ainda não foi lançado.
            } = req.body;
        
            // Validar se os campos obrigatórios estão presentes
            if (product === undefined || wholesale_mode === undefined) {
              return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
            }
        
            // Construir o objeto da oferta com base no esquema
            const newOffer = {
              product, // id do produto
              wholesale_mode, // 0: Oferta apenas no varejo. 1: Oferta no varejo e atacado.  2: Oferta apenas no atacado.
              seller_price,  // O preço de venda para varejo. Deve ser especificado quando o modo atacado for 0 ou 1.
              tier_one_seller_price,  // O preço de venda para pedidos por atacado (10-99 unidades). Deve ser especificado quando o modo atacado for 1 ou 2.
              tier_two_seller_price, // O preço de venda para pedidos por atacado (100 unidades ou mais). Deve ser especificado quando o modo atacado for 1 ou 2.
              status: status || 1, // Se o status não for fornecido, definir como 1 (ativo) por padrão
              keys: keys || 0, // Se as chaves não forem fornecidas, definir como 0 por padrão
              is_preorder: is_preorder || false, // Se não for fornecido, definir como false por padrão
            };
        
            // Fazer a solicitação POST para a API Gamivo para criar uma nova oferta
            const response = await axios.put(`${url}/api/public/v1/offers/by-external-id`, newOffer, {
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
})

app.get('/search/:id', async (req, res) => {
      // Lista os jogos que estão a venda
      const {id} = req.params;
      try {
            const response = await axios.get(`${url}/api/public/v1/offers/${id}`, {
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