// Arquivo que irá fazer requisições na nossa própria API, para realizar alguma tarefa que precise acessar mais de 1 endpoint da gamivo

const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL

const attPrices = async (req, res) => {
    // Recebe os jogos que estão/tiveram a venda, compara para saber se tem o melhor preço e edita a oferta

    // Passo a passo
    // 1- Receber a lista das nossas ofertas(/productIds). ROTA PROPRIA
    // 2 - Comparar com os vendedores concorrentes daquele jogo(/compareAll). ROTA PROPRIA
    // 3 - Editar oferta para inserir o preço atualizado. ROTA PROPRIA EM PROGRESSO(fazer isso com key de teste)
    // NO MOMENTO: passo 1

    // Definir o productId do jogo em questão
    try {
        const response1 = await axios.get(`${nossaURL}/api/products/productIds`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const myProductIds = response1.data;
        // const myProductIds = [31004, 1622240, 142477];

        //Comparar tudo de uma vez
        // const response2 = await axios.post(`${nossaURL}/api/products/compareAll`, {myProductIds}, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     },
        // });

        //Comparar somente um
        for (let id of myProductIds) {
            try {
                const response2 = await axios.get(`${nossaURL}/api/products/compareById/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
                console.log(response2.data);
            }
            catch (error) {
                // console.error(error);
                res.status(500).json({ error: 'Erro ao consultar a nossa API /compareById.' });
            }
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a nossa API /productIds.' });
    }


    //   res.json(myProductIds);
    res.json('attPrices');


    //Tarefas:
    // Colocar chaves de teste a venda para testar como funciona a venda

    // Ideias futuras: 
    // Definir o tempo que a api irá ficar checando se ainda está como o melhor preço
    // Calculo do limite de preço deve ser: custo do jogo + taxa da gamivo + lucro mínimo, aí na hr de listar 1 centavo mais barato, o novo preço tem que ser maior do que o preço mínimo.
}

module.exports = {
    attPrices
}