const axios = require('axios');
const url = process.env.URL;
const token = process.env.TOKEN;
const slugify = require('slugify');

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
                  quatidadeTotal += response.data.length; // Quantidade total de ofertas

                  if (response.data.length == 0) { // Aqui que termina o loop do while
                        console.log(`Ativos: ${totalAtivos}; Inativos: ${totalInativos}`); // Anúncios ativos e não ativos
                        console.log(`Acabou!`);
                        res.json(productIds);
                        isDone = true;
                        return;
                  }

                  for (var i = 0; i < response.data.length; i++) {
                        var productId = response.data[i].product_id;

                        response.data[i].status == 1 ? totalAtivos += 1 : totalInativos += 1;

                        console.log(`productId: ${productId}`);
                        productIds.push(productId);


                        //Lógica para saber o nome dos jogos impossíveis, ids descobertos pela rota compareById
                        // if(productId === 74797 || productId === 78621 || productId === 26374 || productId === 1622240){ // ids de jogos impossíveis
                        //      console.log(`Jogo impossível detectado: ${JSON.stringify(response.data[i])}`);
                        // }

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

      const { myProductIds } = req.body;

      let bestPrices = [], impossibleGames = [];


      for (let i = 0; i < myProductIds.length; i++) {
            try {
                  // Procurar por outras pessoas vendendo aquele msm jogo
                  var response = await axios.get(`${url}/api/public/v1/products/${myProductIds[i]}/offers`, {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        },
                  });

                  // Descobrir qual é o menor preço que ele está sendo vendido
                  let menorPreco = Number.MAX_SAFE_INTEGER; // Define um preço alto para depois ser substituído pelos menores preços de verdade
                  if (response.data.length == 0) {
                        console.log(`Você é o único vendedor do productId: ${myProductIds[i]}`);
                  } else {
                        for (const produto of response.data) {
                              // Obtém o preço de varejo do produto
                              const precoAtual = produto.retail_price;

                              if (precoAtual < menorPreco) {
                                    menorPreco = precoAtual;
                              }
                        }
                        console.log(`Menor preço do productId: ${myProductIds[i]} é: ${menorPreco}`);
                        bestPrices.push(menorPreco);
                  }

            } catch (error) {
                  if (error.response.status == 404 || error.response.status == 403) {
                        impossibleGames.push(myProductIds[i]);
                  } else {
                        console.error(error);
                        res.status(500).json({ error: 'Erro ao consultar a API externa.' });
                  }
            }

      }
      console.log(`Esses são os ids dos jogos impossíveis: ${impossibleGames}`);
      console.log(`Quantidade de jogos impossíveis: ${impossibleGames.length}`);
      res.json(bestPrices);
}

const compareById = async (req, res) => {
      // Comparar o preço dos concorrentes pelo id do jogo e descobrir qual é o menor preço

      //  Passo a passo
      // Definir o productId do jogo em questão
      // Procurar por outras pessoas vendendo aquele msm jogo
      // Descobrir qual é o menor preço que ele está sendo vendido

      // Definir o productId do jogo em questão
      const { id } = req.params; // O jogo está sendo recebido pelo id nos params
      let qtdCandango = 0;
      try {
            // Procurar por outras pessoas vendendo aquele msm jogo
            const response = await axios.get(`${url}/api/public/v1/products/${id}/offers`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            
            // res.json(response.data); // Só descomentar caso queira ver as informações dos vendedores do jogo
            // return;
            
            // Descobrir qual é o menor preço que ele está sendo vendido
            let menorPrecoSemCandango = Number.MAX_SAFE_INTEGER; // 
            let menorPrecoTotal = Number.MAX_SAFE_INTEGER; // Define um preço alto para depois ser substituído pelos menores preços de verdade
            let menorPreco;

            for (const produto of response.data) {
                  let ignoreSeller = false; // True = candango, false = vendedor experiente
                  // Obtém o preço de varejo do produto

                  const { retail_price: precoAtual, completed_orders: quantidadeVendas } = produto; // Preço de varejo e quantidade de vendas do concorrente

                  if (quantidadeVendas < 4000) {
                        ignoreSeller = true;
                        qtdCandango++;
                  }
                  // if(!ignoreSeller){
                  //       console.log(`TOP: ${quantidadeVendas}`)
                  //       if (precoAtual < menorPreco) {
                  //             menorPreco = precoAtual;
                  //       }
                  // }else{
                  //       qtdCandango++;
                  //       console.log(`IGNORADO: ${quantidadeVendas}`)
                  // }

                  if (precoAtual < menorPrecoTotal) {
                        menorPrecoTotal = precoAtual; // Define um preço independente se é candango ou não
                  }
                  
                  if(precoAtual < menorPrecoSemCandango){
                        if(!ignoreSeller){ // Se não for candango
                              menorPrecoSemCandango = precoAtual; // Define um preço considerando SOMENTE vendedores experientes
                        }
                  }
            }
            
            if(qtdCandango >= 3){
                  console.log(`qtdCandango: ${qtdCandango} do id: ${id} `); // Considera o preço menor independente
                  menorPreco = menorPrecoTotal;
            }else{ 
                  menorPreco = menorPrecoSemCandango; // Considera SOMENTE os preços dos vendedores experientes
            }

            if (response.data.length == 0) {
                  console.log(`Você é o único vendedor do productId: ${id}`)
                  res.json({ id, menorPreco: -2 }); // Sem concorrentes
            } else {
                  console.log(`menorPrecoTotal: ${menorPrecoTotal}, menorPrecoSemCandango: ${menorPrecoSemCandango}`)
                  
                  res.json({ id, menorPreco });
            }
            // Checar se nós já somos o menor preço
      } catch (error) {
            // console.log('Esse é o error.response: ' + error);
            if (error.response.status == 404 || error.response.status == 403) {
                  console.log(`Id: ${id} é de um jogo 'impossível'`)
                  res.json({ id, menorPreco: -1 });
            } else {
                  console.error(error);
                  res.status(500).json({ error: 'Erro ao consultar a API externa.' });
            }
      }
}

const productsBySlug = async (req, res) => {
      const { gameName } = req.body;

      try {
            const sluggedName = slugify(gameName);
            console.log(sluggedName);
            const response = await axios.get(`${url}/api/public/v1/products/by-slug/${sluggedName}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`
                  },
            });
            res.json(response.data);
      } catch (error) {
            // console.error(error);
            res.status(500).json({ error: 'Erro ao consultar a API externa.' });
      }
}

module.exports = {
      productsList,
      productIds,
      compareAll,
      compareById,
      productsBySlug
}