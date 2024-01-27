// Arquivo que irá fazer requisições na nossa própria API, para realizar alguma tarefa que precise acessar mais de 1 endpoint da gamivo

const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;



const attPrices = async (req, res) => {
    // Recebe os jogos que estão/tiveram a venda, compara para saber se tem o melhor preço e edita a oferta

    // Passo a passo
    // 1- Receber a lista das nossas ofertas(/productIds). FEITO
    // 2 - Comparar com os vendedores concorrentes daquele jogo(/compareAll). FEITO
    // 3 - Buscar o offerId daquele jogo. FEITO
    // 4 - Buscar as keys daquele jogo. FEITO
    // 5 - Buscar os dados daquele jogo na planilha com base na key. EM PROGRESSO
    // 6 - Editar oferta para inserir o preço atualizado. 

    const hora1 = new Date().toLocaleTimeString();

    try {
        var keysInXLSX = [], keysWithHttps = [], jogosAtualizados = [];
        const response1 = await axios.get(`${nossaURL}/api/products/productIds`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        // const myProductIds = response1.data;
        const myProductIds = [34229, 37305, 145315, 11913, 46142, 71930];

        //Comparar somente um por vez
        for (let productId of myProductIds) {
            // let productId = 34229;

            try {
                const response2 = await axios.get(`${nossaURL}/api/products/compareById/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes, -4 quando já for o melhor preço
                // console.log(response2.data);

                // const dataToEdit = response2.data;

                const dataToEdit = {
                    productId: response2.data.id,
                    menorPreco: response2.data.menorPreco,
                    offerId: response2.data.offerId
                };
                // console.log(dataToEdit);

                try {
                    const response3 = await axios.put(`${nossaURL}/api/offers/editOffer`, dataToEdit, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
                    console.log(response3.data);
                    if(response3.data > 0){
                        jogosAtualizados.push(response3.data);
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Erro ao consultar a nossa API /editOffer.' });
                }

            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro ao consultar a nossa API /compareById.' });
            }
        }
        const hora2 = new Date().toLocaleTimeString();
        console.log(`Horário de início: ${hora1}, horário de término: ${hora2}`);
        res.json({ jogosAtualizados, error: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a nossa API /productIds.' });
    }

    //Tarefas:
    // Colocar chaves de teste a venda para testar como funciona a venda

    // Ideias futuras: 
    // Definir o tempo que a api irá ficar checando se ainda está como o melhor preço
    // Calculo do limite de preço deve ser: custo do jogo + taxa da gamivo + lucro mínimo, aí na hr de listar 1 centavo mais barato, o novo preço tem que ser maior do que o preço mínimo.
}

module.exports = {
    attPrices
}