// Arquivo que irá fazer requisições na nossa própria API, para realizar alguma tarefa que precise acessar mais de 1 endpoint da gamivo

const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL

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
    let keysInXLSX = [];

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
        for (let productId of myProductIds) {
            try {
                const response2 = await axios.get(`${nossaURL}/api/products/compareById/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
                console.log(response2.data);

                if (response2.data.menorPreco > 0) {
                    try {
                        const response3 = await axios.get(`${nossaURL}/api/offers/returnOfferId/${productId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                        }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
                        if (response3.data > 0) {
                            console.log(`Id da oferta: ${response3.data}`);
                            const offerId = response3.data;

                            try {
                                const response4 = await axios.get(`${nossaURL}/api/offers/offerKeys/${offerId}`, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    },
                                });
                                let keys = response4.data;
                                // console.log(`Keys: ${keys}`); 

                                for (let key of keys) {

                                    if (key.startsWith("https") || key == "Z6LCN-84FCF-7M393" || "66LBE-PIPR3-E2IG5 / 5JWA4-VPMTY-C5JM6 / 7F6FM-2VJ02-2Z0XI / 6ZEQG-IY990-82PHD / 6BL7F-PITBV-8F47C / 78DDZ-T20TQ-VLV4Q / 78F4G-CZ7E3-67GJT / 6CMK9-TIA4K-GDKMB / 6GFZQ-FRRR6-ZA6MQ / 620IE-NEJGV-JGG80") { // A chave é um link(steam, gog), iremos ter que tratar para procurar dps || Z6LCN-84FCF-7M393 não tem valor pago
                                        console.log(`Dados da key: Chave não encontrada na planilha`);
                                        // Tratar qnd for o nome do jogo(provavelmente cagada de alguém), oferta 2831584
                                    } else {
                                        const response5 = await axios.get(`${nossaURL}/api/sheets/dataKeysAnalyse/${key}`, {
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            },
                                        });
                                        const keyData = response5.data;
                                        if (keyData.error) {
                                            console.log(`Erro: ${keyData.error}`);
                                        } else {
                                            keysInXLSX.push(key);
                                            console.log(`keysInXLSX++`);
                                        }
                                    }
                                }
                            } catch (error) {
                                console.error(error);
                                res.status(500).json({ error: 'Erro ao consultar a nossa API /offerKeys.' });
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ error: 'Erro ao consultar a nossa API /returnOfferId.' });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro ao consultar a nossa API /compareById.' });
            }
        }
        const hora2 = new Date().toLocaleTimeString();
        console.log(`Horário de início: ${hora1}, horário de término: ${hora2}`);
        res.json(keysInXLSX);
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