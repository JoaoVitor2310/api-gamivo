// Arquivo que irá fazer requisições na nossa própria API, para realizar alguma tarefa que precise acessar mais de 1 endpoint da gamivo

const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;
const ExcelJS = require('exceljs');
const path = require('path');

const catchFromSheet = async (req, res) => 
{
    const filePath = '../BestbuyTrue.xlsx';
    const sheetName = 'Venda-Chave-Troca';

    const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.resolve(__dirname, filePath));

  const sheet = workbook.getWorksheet(sheetName);
  const data = [];
  let rowCount = 0; // Contador de linhas preenchidas

  // Número da coluna que você deseja percorrer (no exemplo, coluna 'C')
  const columnNumber = 3; // 3 representa a coluna 'C'

  // Percorre cada linha na planilha
  sheet.eachRow(async (row, rowNumber) => {
    // Obtém a célula na coluna desejada
    const jogoHBCell = row.getCell(columnNumber);

    // Verifica se a célula não está vazia
    if (jogoHBCell.value) {
      rowCount++;

      // Obtém a cor do preenchimento da célula 'Jogo HB'
      const corCelula = jogoHBCell.fill ? jogoHBCell.fill.fgColor : null;

      // Verifica se a cor é vermelha
      if (corCelula && corCelula.argb === 'FFFF0000') {
        console.log(`Cor vermelha encontrada na célula 'Jogo HB' na linha ${rowNumber}. Jogo HB: ${jogoHBCell.value}`);
        const jogo = {
          'Chave Recebida': row.getCell(2).value, // Coluna 'B'
        'Vendido': 'Posto a Venda',
        'Jogo HB': jogoHBCell.value,
        'Vendido Por': row.getCell(5).value, // Coluna 'E'
        'Valor G2A': row.getCell(6).value, // Coluna 'F'
        'V.R. (Real)': row.getCell(8).value, // Coluna 'H'
        'V. R. (Simulação)': row.getCell(9).value, // Coluna 'I'
        'Jogo Entregue': row.getCell(11).value, // Coluna 'K'
        'Valor Pago': row.getCell(12).value, // Coluna 'L'
        'Valor Mín. Venda': row.getCell(13).value, // Coluna 'M'
        'Receita (R$)': row.getCell(18).value, // Coluna 'R'
        };
        data.push(jogo);
        console.log('\n');
        console.log('\n');
        console.log('\n');
        console.log('\n');
    
        
      } else if (corCelula && corCelula.argb === 'FFFFFF00') {
        // Verifica se a cor é amarela
        console.log(`Cor amarela encontrada na célula 'Jogo HB' na linha ${rowNumber}. Jogo HB: ${jogoHBCell.value}`);
      const jogo = {
        'Chave Recebida': row.getCell(2).value, // Coluna 'B'
        'Vendido': 'Posto a Venda',
        'Jogo HB': jogoHBCell.value,
        'Vendido Por': row.getCell(5).value, // Coluna 'E'
        'Valor G2A': row.getCell(6).value, // Coluna 'F'
        'V.R. (Real)': row.getCell(8).value, // Coluna 'H'
        'V. R. (Simulação)': row.getCell(9).value, // Coluna 'I'
        'Jogo Entregue': row.getCell(11).value, // Coluna 'K'
        'Valor Pago': row.getCell(12).value, // Coluna 'L'
        'Valor Mín. Venda': row.getCell(13).value, // Coluna 'M'
        'Receita (R$)': row.getCell(18).value, // Coluna 'R'
      };
      data.push(jogo);
      console.log('\n');
      console.log('\n');
      console.log('\n');
      console.log('\n');

      } else {
        // Código anterior permanece o mesmo
        const jogo = {
        'Chave Recebida': row.getCell(2).value, // Coluna 'B'
        'Vendido': 'Posto a Venda',
        'Jogo HB': jogoHBCell.value,
        'Vendido Por': row.getCell(5).value, // Coluna 'E'
        'Valor G2A': row.getCell(6).value, // Coluna 'F'
        'V.R. (Real)': row.getCell(8).value, // Coluna 'H'
        'V. R. (Simulação)': row.getCell(9).value, // Coluna 'I'
        'Jogo Entregue': row.getCell(11).value, // Coluna 'K'
        'Valor Pago': row.getCell(12).value, // Coluna 'L'
        'Valor Mín. Venda': row.getCell(13).value, // Coluna 'M'
        'Receita (R$)': row.getCell(18).value, // Coluna 'R'
        };
        data.push(jogo);
      }
    }
  });
  console.log(`Quantidade de células preenchidas na coluna 'C': ${rowCount}`);
  res.json(data);
}

module.exports = {
    catchFromSheet
}