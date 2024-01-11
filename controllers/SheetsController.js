const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;
const ExcelJS = require('exceljs');
const path = require('path');

const catchFromSheet = (req, res) => {
  const filePath = '../BestbuyTrue.xlsx';
  const sheetName = 'Venda-Chave-Troca';

  const workbook = new ExcelJS.Workbook();

  workbook.xlsx.readFile(path.resolve(__dirname, filePath)).then(() => {
    const sheet = workbook.getWorksheet(sheetName);
    const data = [];
    let rowCount = 0; // Contador de linhas preenchidas elegíveis

    // Número da coluna que você deseja percorrer (no exemplo, coluna 'C')
    const columnNumber = 3; // 3 representa a coluna 'C'

    // Percorre cada linha na planilha
    sheet.eachRow((row, rowNumber) => {
      // Obtém a célula na coluna desejada
      const jogoHBCell = row.getCell(columnNumber);

      // Verifica se a célula não está vazia
      if (jogoHBCell.value) {
        // Obtém a cor do preenchimento da célula 'Jogo HB'
        const corCelula = jogoHBCell.fill ? jogoHBCell.fill.fgColor : null;

        // Verifica se a cor é vermelha, amarela ou preta
        if (corCelula && (corCelula.argb === 'FFFF0000' || corCelula.argb === 'FFFFFF00' || corCelula.argb === 'FF000000')) {
          const coluna1Cell = row.getCell(1); // Coluna 'A' - "Colunas 1"
          const vendidoPorCell = row.getCell(5); // Coluna 'E' - "Vendido Por"

          // Verifica se 'Colunas 1' contém "RK" e 'Vendido Por' é "Gamivo"
          if (coluna1Cell.value.includes('RK') && vendidoPorCell.value === 'Gamivo') {
            console.log(`Cor ${
              corCelula.argb === 'FFFF0000' ? 'vermelha' :
              corCelula.argb === 'FFFFFF00' ? 'amarela' :
              corCelula.argb === 'FF000000' ? 'preta' : ''
            } encontrada na célula 'Jogo HB' na linha ${rowNumber}. Jogo HB: ${jogoHBCell.value}`);

            const chaveRecebidaCell = row.getCell(2); // Coluna 'B' - "Chave Recebida"
            const valorSimulacaoCell = row.getCell(9); // Coluna 'I' - "V. R. (Simulação)"
            const valorPagoCell = row.getCell(12); // Coluna 'L' - "Valor Pago"

            const valorSimulacao = valorSimulacaoCell.value instanceof Object ? valorSimulacaoCell.value.result : parseFloat(valorSimulacaoCell.value);
            const valorPago = parseFloat(valorPagoCell.value);

            // Faz as comparações e imprime as informações desejadas
            if (valorSimulacao >= 1.7 * valorPago) {
              console.log(`Valor de Simulação é pelo menos 70% maior que Valor Pago: ${valorSimulacao} >= ${1.7 * valorPago}`);
            }

            if (valorSimulacao >= 1.5 * valorPago) {
              console.log(`Valor de Simulação é pelo menos 50% maior que Valor Pago: ${valorSimulacao} >= ${1.5 * valorPago}`);
            }

            const jogo = {
              'Chave Recebida': chaveRecebidaCell.value,
              'Vendido': determineStatus(corCelula.argb),
              'Jogo HB': jogoHBCell.value,
              'Vendido Por': vendidoPorCell.value,
              'Valor G2A': row.getCell(6).value,
              'V.R. (Real)': valorSimulacao,
              'V. R. (Simulação)': null,  // Agora estamos usando 'V.R. (Real)' para a simulação
              'Jogo Entregue': row.getCell(11).value,
              'Valor Pago': valorPago,
              'Valor Mín. Venda': row.getCell(13).value,
              'Receita (R$)': row.getCell(18).value.result,
            };

            data.push(jogo);
            rowCount++;
          }
          console.log('\n');
        }
      }
    });

    if (rowCount > 0) {
      console.log(`Quantidade de células preenchidas elegíveis na coluna 'C': ${rowCount}`);
      res.json(data);
    } else {
      console.log('Nenhuma célula preenchida elegível encontrada.');
      res.json({ message: 'Nenhuma célula preenchida elegível encontrada.' });
    }
  });
};

function determineStatus(corCelula) {
  // Determina o status com base na cor da célula
  if (corCelula === 'FFFF0000') {
    return 'Sim'; // Vermelho
  } else if (corCelula === 'FFFFFF00') {
    return 'Posto a venda'; // Amarelo
  } else if (corCelula === 'FF000000') {
    return 'Ainda não posto a venda'; // Preto
  } else {
    return ''; // Outros casos
  }
}

module.exports = {
  catchFromSheet,
};
