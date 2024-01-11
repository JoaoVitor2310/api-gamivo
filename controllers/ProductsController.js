const axios = require('axios');
const url = process.env.URL;
const token = process.env.TOKEN;

const productsList = async (req, res) => { // Penúltimo endpoint de products
    // Lista os jogos que o usuário tem disponível? Agora estou na dúvida se é isso msm. Útil para ver os detalhes dos jogos
    // Ainda não sei como pode ser útil para a gente
    const { offset = 0, limit = 100 } = req.query;

    // const offset = 100; // A partir de qual jogo vai mostrar
    // const limit = 100; // Limit por página, não pode ser maior que 100

    try {
          const response = await axios.get(`${url}/api/public/v1/products?offset=${offset}&limit=${limit}`, {
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
}

const productIds = async (req, res) => {
    // Lista os jogos que estão/tiveram a venda, podem ter jogos com o status 0 pelo visto.
    let { offset = 100, limit = 100 } = req.query;

    // offset: A partir de qual jogo vai mostrar
    // limit: Limite por página, não pode ser maior que 100
    let productIds = [], quantidade = 0, quatidadeTotal = 0, isDone = false, totalAtivos = 0, totalInativos = 0;
    while (!isDone) {
          try {
                const response = await axios.get(`${url}/api/public/v1/offers?offset=${offset}&limit=${limit}`, {
                      headers: {
                            'Authorization': `Bearer ${token}`
                      },
                });
                quantidade = response.data.length;
                quatidadeTotal += response.data.length;

                if (response.data.length == 0) {
                      console.log(`Ativos: ${totalAtivos}; Inativos: ${totalInativos}`);
                      console.log(`Acabou!`);
                      res.json(productIds);
                      isDone = true;
                      return;
                }

                for (var i = 0; i < response.data.length; i++) {
                      var productId = response.data[i].product_id;

                      response.data[i].status == 1 ? totalAtivos += 1 : totalInativos += 1;

                      console.log(`porductId: ${productId}`);
                      productIds.push(productId);
                }
                offset += 100;
                console.log(`Offset: ${offset}`);
          } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro ao consultar a API externa.' });
          }
    }
}

const compareAll = async (req, res) => {
    // Comparar o preço dos concorrentes daquele jogo e descobrir qual é o menor preço

    //  Passo a passo
    // Definir o productId do jogo em questão
    // Procurar por outras pessoas vendendo aquele msm jogo
    // Descobrir qual é o menor preço que ele está sendo vendido

    // Definir o productId do jogo em questão
    const myGames = [1, 2, 3]; // Substituir pelo array dos jogos disponíveis na gamivo

    for (let i = 0; i < myGames.length; i++) {
          try {
                // Procurar por outras pessoas vendendo aquele msm jogo
                const response = await axios.get(`${url}/api/public/v1/products/${myGames[i]}/offers`, {
                      headers: {
                            'Authorization': `Bearer ${token}`
                      },
                });
                // console.log(slugify(response.data.product_name))
                // res.json(response.data); // Check

                // Descobrir qual é o menor preço que ele está sendo vendido
                let menorPreco = Number.MAX_SAFE_INTEGER; // Define um preço alto para depois ser substituído pelos menores preços de verdade

                if (response.data.length == 0) {
                      console.log(`Você é o único vendedor do productId: ${myGames[i]}`);
                } else {
                      for (const produto of response.data) {
                            // Obtém o preço de varejo do produto
                            const precoAtual = produto.retail_price;

                            if (precoAtual < menorPreco) {
                                  menorPreco = precoAtual;
                            }
                      }
                      console.log(`Menor preço do productId: ${myGames[i]} é: ${menorPreco}`);
                }
                
                // Colocar chaves de teste a venda para testar como funciona a venda

                // Ideias futuras: 
                // Ver se vale a pena vender o jogo 1 centavo mais barato, comparando esse preço com a tabela de custos
                // Definir o limite de preço, para não abaixar muito, isso é até melhor que a ideia de cima
                // Definir o tempo que a api irá ficar checando se ainda está como o melhor preço
                // Calculo do limite de preço deve ser: custo do jogo + taxa da gamivo + lucro mínimo, aí na hr de listar 1 centavo mais barato, o novo preço tem que ser maior do que o preço mínimo.


          } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro ao consultar a API externa.' });
          }

    }

    // produto 71215 - offer 2499645 - Iron Sea: Lost Land DLC EN/DE/RU Global - verde
    // produto 33680 - offer 33680 - The King's Bird EN/DE/FR/RU/ZH/ES Global - laranja
}

const compareById = async (req, res) => {
    // Comparar o preço dos concorrentes pelo id do jogo e descobrir qual é o menor preço

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



    } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao consultar a API externa.' });
    }


    // produto 71215 - offer 2499645 - Iron Sea: Lost Land DLC EN/DE/RU Global - verde
    // produto 33680 - offer 33680 - The King's Bird EN/DE/FR/RU/ZH/ES Global - laranja
}

module.exports = {
    productsList,
    productIds,
    compareAll,
    compareById
}