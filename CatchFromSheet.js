const ExcelJS = require('exceljs');
const path = require('path');

async function getDataFromSheet(filePath, sheetName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.resolve(__dirname, filePath));

  const sheet = workbook.getWorksheet(sheetName);
  const data = [];
  let rowCount = 0; // Contador de linhas preenchidas

  // Número da coluna que você deseja percorrer (no exemplo, coluna 'B')
  const columnNumber = 2; 

  // Percorre cada linha na planilha
  sheet.eachRow(async (row, rowNumber) => {
    // Obtém a célula na coluna desejada
    const chaveRecebidaCell = row.getCell(columnNumber);

    // Verifica se a célula não está vazia
    if (chaveRecebidaCell.value) {
      rowCount++;

      // Obtém a cor do preenchimento da célula 'Chave Recebida'
      const corCelula = chaveRecebidaCell.fill ? chaveRecebidaCell.fill.fgColor : null;
      console.log(chaveRecebidaCell.fill);
      // Verifica se a cor é vermelha
      if (corCelula && corCelula.argb === 'FFFF0000') {
        const jogo = {
          'Chave Recebida': chaveRecebidaCell.value,
          'Vendido': 'Sim',
        };
        data.push(jogo);
      } else {
        const jogo = {
          'Chave Recebida': chaveRecebidaCell.value,
          'Vendido': 'Não',
        };
        data.push(jogo);
      }
    }
  });

  console.log(`Quantidade de células preenchidas na coluna 'B': ${rowCount}`);
  return data;
}

async function main() {
  try {
    const filePath = 'BestbuyTrue.xlsx';
    const sheetName = 'Venda-Chave-Troca';

    const jogosPorPlataforma = await getDataFromSheet(filePath, sheetName);

    console.log(jogosPorPlataforma);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

main();
