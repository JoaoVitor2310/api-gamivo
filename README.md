# API Gamivo

### Sobre o projeto:
Cliente: Bestbuy86  
Stack: Node.js, Javascript, Axios, Node-cron, Deploy, Linux, VPS(máquina virtual), SSH.  
Quando fui abordado sobre a criação de uma API para atualizar preços dos jogos em um marketplace achei que seria uma ótima oportunidade para colocar os meus conhecimentos em prática, logo decidi topar e iniciar os trabalhos.  
Essa API tem o objetivo de atualizar os preços dos jogos ofertados pelo cliente no site Gamivo.com, ele pediu para que fosse inserida algumas regras, como não diminuir o valor muito abaixo do menor concorrente, não considerasse abaixar se o preço tivesse muito abaixo dos demais concorrentes, não diminuir se o concorrente fosse um novato no site e também não disputar o preço com outras API's para não abaixar demais o preço.  

#### Todos esses requisitos foram cumpridos e a API está rodando em produção em uma máquina virtual na Hostinger.


### Para rodar(Linux Ubuntu/Debian):

`sudo apt install -y git nodejs` Git e Node serão necessários para baixar e executar o projeto respectivamente.  
`git clone https://github.com/JoaoVitor2310/api-gamivo`  
`cd api-gamivo` Entre no diretório com os arquivos.  
`npm install`  
`sudo apt-get install npm` Para instalar o npm.  
`cp .env-example .env` Não esqueça de inserir todas as variáveis de ambiente.  
`pm2 start index.js` Para manter a aplicação rodando em segundo plano.   
Caso tenha erro ao rodar o pm2: `npm install -g pm2`  
Se for modificar a API: `npm run dev`   
`pm2 startup` Para finalmente iniciar a API   

#### Documentação API Gamivo

Exportar - https://www.gamivo.com/api-documentation/public  
Importar - https://www.gamivo.com/assets/documents/documentation/API/public-api-import.pdf
