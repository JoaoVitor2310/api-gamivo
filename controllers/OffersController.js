const axios = require('axios');
const url = process.env.URL;
const token = process.env.TOKEN;


const offerList = async (req, res) => {
      // Lista os jogos que estão a venda em páginas de 100
      const { offset = 100, limit = 100 } = req.query;
      // Offset = A partir de qual jogo vai mostrar
      // Limit = Limite por página, não pode ser maior que 100

      try {
            // Offerlist normal
            const response = await axios.get(`${url}/api/public/v1/offers?offset=${offset}&limit=${limit}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            const quantidade = response.data.length;
            console.log(quantidade);
            res.json(response.data);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

const createOffer = async (req, res) => {
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
}

const searchOfferById = async (req, res) => {
      // Procura a oferta pelo id
      const { id } = req.params;
      try {
            const response = await axios.get(`${url}/api/public/v1/offers/${id}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            // console.log(response.data.product_name);
            //     console.log(slugify(response.data.product_name))
            res.json(response.data);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

const editOffer = async (req, res) => {
      // Passo a passo
      // Recebe o offerId, limite da api, ...
      // Edita pelo offerId
      // Edita os dados
      // Armazena a hora que foi editado

      const { offerId, minPrice } = req.params;
      try {
            const response = await axios.put(`${url}/api/public/v1/offers/${offerId}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            // console.log(response.data.product_name);
            // console.log(slugify(response.data.product_name))

            // Registrar o horário que foi editado
            res.json(response.data);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}
const returnOfferId = async (req, res) => {
      // Retornar o offerId daquele productId

      const { productId } = req.params; // O jogo está sendo recebido pelo id nos params
      try {
            const response = await axios.get(`${url}/api/public/v1/products/${productId}/offers`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });

            // console.log(response.data);
            // res.json(response.data);

            var objetoEncontrado = response.data.find(function (objeto) { // Procura pelo objeto que é vendido por nós, e retorna a offerId
                  return objeto.seller_name === 'Bestbuy86'; // Nome do vendedor tem que ser da nossa loja
            });

            if(!objetoEncontrado){ // Se nós temos o produto mas a oferta não está ativa(status = 0)
                  res.json(-3); // offerId é retornada como -3 para identificar que não estamos vendendo aquele jogo atualmente
                  return;
            }

            res.json(objetoEncontrado.id); // offerId é retornada
            return;
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

const offerKeys = async (req, res) => {
      // Passo a passo
      // Recebe o offerId, limite da api, ...
      // Edita pelo offerId
      // Edita os dados
      // Armazena a hora que foi editado

      const { offerId } = req.params;
      const limit = 250, offset = 0;
      try {
            const response = await axios.get(`${url}/api/public/v1/offers/${offerId}/keys/active/${offset}/${limit}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            let keys = [], count;
            
            count = response.data.count;

            for(let i = 0; i < count; i++){
                  keys.push(response.data.data[i].content);
            };
            // console.log(keys);

            res.json(keys);
      } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

module.exports = {
      offerList,
      createOffer,
      searchOfferById,
      editOffer,
      offerKeys,
      returnOfferId
}