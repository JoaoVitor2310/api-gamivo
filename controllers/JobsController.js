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
    const myGames = [1, 2, 3]; // Substituir pelo array dos jogos disponíveis na gamivo

    try {
        const response = await axios.get(`${nossaURL}/productIds}`, {
            headers: {
                  'Authorization': `Bearer ${token}`
            },
      });
      res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a nossa API.' });
    }

    // Erros
    //entre 63879 e 35660(pelo array, é o 141433) dá erro ao consultar a API possivelmente pelo array estar desatualizado com a lista de jogos disponíveis para venda(já vendeu algum daqueles jogos)

    //Tarefas:
    // Descobrir como aquele array gigante com os jogos que o usuário tem é formado(como conseguir os productId dos nossos jogos)
    // Descobrir como buscar os dados da planilha e utilizar nos endpoints
    // Colocar chaves de teste a venda para testar como funciona a venda

    // Ideias futuras: 
    // Ver se vale a pena vender o jogo 1 centavo mais barato, comparando esse preço com a tabela de custos
    // Definir o limite de preço, para não abaixar muito, isso é até melhor que a ideia de cima
    // Definir o tempo que a api irá ficar checando se ainda está como o melhor preço
    // Calculo do limite de preço deve ser: custo do jogo + taxa da gamivo + lucro mínimo, aí na hr de listar 1 centavo mais barato, o novo preço tem que ser maior do que o preço mínimo.

    // produto 71215 - offer 2499645 - Iron Sea: Lost Land DLC EN/DE/RU Global - verde
    // produto 33680 - offer 33680 - The King's Bird EN/DE/FR/RU/ZH/ES Global - laranja
}

module.exports = {
    attPrices
}