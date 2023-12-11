const express = require('express');
const axios = require('axios');
const { default: slugify } = require('slugify');
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

app.get('/search/offer/:id', async (req, res) => {
      // Procura a oferta pelo id
      const { id } = req.params;
      try {
            const response = await axios.get(`${url}/api/public/v1/offers/${id}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            // console.log(response.data.product_name);
            console.log(slugify(response.data.product_name))
            res.json(response.data);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
})

app.get('/compare/:id', async (req, res) => { 
      // Comparar o preço dos concorrentes daquele jogo e descobrir qual é o menor preço
      
      //  Passo a passo
      // Definir o productId do jogo em questão
      // Procurar por outras pessoas vendendo aquele msm jogo
      // Descobrir qual é o menor preço que ele está sendo vendido
      
      // Definir o productId do jogo em questão
      const { id } = req.params; // O jogo está sendo recebido pelo id nos params

      try {
            // Procurar por outras pessoas vendendo aquele msm jogo
            const response = await axios.get(`${url}/api/public/v1/products/${id}/offers`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            // console.log(slugify(response.data.product_name))
            res.json(response.data); // Check
            
            // Descobrir qual é o menor preço que ele está sendo vendido
            let menorPreco = Number.MAX_SAFE_INTEGER; // Define um preço alto para depois ser substituído pelos menores preços de verdade

            for (const produto of response.data) {
                  // Obtém o preço de varejo do produto
                  const precoAtual = produto.retail_price;

                  if (precoAtual < menorPreco) {
                        menorPreco = precoAtual;
                  }
            }

            console.log('Menor preço de varejo:', menorPreco);

            // Ideias futuras: ver se vale a pena vender o jogo 1 centavo mais barato, comparando esse preço com a tabela de custos
            // Definir o limite de preço, para não abaixar muito, isso é até melhor que a ideia de cima
            // Definir o tempo que a api irá ficar checando se ainda está como o melhor preço

      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }


      // produto 71215 - offer 2499645 - Iron Sea: Lost Land DLC EN/DE/RU Global - verde
      // produto 33680 - offer 33680 - The King's Bird EN/DE/FR/RU/ZH/ES Global - laranja
})