const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;
const ExcelJS = require('exceljs');
const path = require('path');

const determineStatus = (corArgb, vendidoPor) => {
  if (vendidoPor !== 'Gamivo') {
    return 'N/A';
  }

  if (corArgb === 'FFFF0000') {
    return 'Sim'; // Vermelho
  } else if (corArgb === 'FFFFFF00') {
    return 'Posto a Venda'; // Amarelo
  } else if (corArgb === 'FF000000') {
    return 'Ainda não posto a venda'; // Preto
  }

  return 'N/A';
};

const catchFromSheet = (req, res) => {
  const filePath = '../BestbuyTrue.xlsx';
  const sheetName = 'Venda-Chave-Troca';

  const workbook = new ExcelJS.Workbook();

  workbook.xlsx.readFile(path.resolve(__dirname, filePath)).then(() => {
    const sheet = workbook.getWorksheet(sheetName);
    const data = [];
    let rowCount = 0;

    sheet.eachRow((row, rowNumber) => {
      const jogoHBCell = row.getCell(3); // Corrigi o número da coluna para corresponder à sua lógica

      if (jogoHBCell.value) {
        const corCelula = jogoHBCell.fill ? jogoHBCell.fill.fgColor : null;

        if (corCelula && (corCelula.argb === 'FFFF0000' || corCelula.argb === 'FFFFFF00' || corCelula.argb === 'FF000000')) {
          const coluna1Cell = row.getCell(1);
          const vendidoPorCell = row.getCell(5);
          const chaveRecebidaCell = row.getCell(2);
          const valorSimulacaoCell = row.getCell(9);
          const valorPagoCell = row.getCell(12);

          if (coluna1Cell.value.includes('RK') && vendidoPorCell.value === 'Gamivo') {
            const valorSimulacao = valorSimulacaoCell.value instanceof Object ? valorSimulacaoCell.value.result : parseFloat(valorSimulacaoCell.value);
            const valorPago = parseFloat(valorPagoCell.value);

            const jogo = {
              'Chave Recebida': chaveRecebidaCell.value,
              'Vendido': determineStatus(corCelula.argb, vendidoPorCell.value),
              'Jogo HB': jogoHBCell.value,
              'Vendido Por': vendidoPorCell.value,
              'Valor G2A': row.getCell(6).value,
              'V.R. (Real)': valorSimulacao,
              'V. R. (Simulação)': row.getCell(9).value,
              'Jogo Entregue': row.getCell(11).value,
              'Valor Pago': valorPago,
              'Valor Mín. Venda': row.getCell(13).value,
              'Receita (R$)': row.getCell(18).value.result,
              'Messages': [] // Adiciona a propriedade 'Messages' para armazenar mensagens
            };

            if (valorSimulacao >= 1.7 * valorPago) {
              jogo.Messages.push(`Valor de Simulação é pelo menos 70% maior que Valor Pago: ${valorSimulacao.toFixed(4)} >= ${(1.7 * valorPago).toFixed(4)}`);
            } else {
              jogo.Messages.push(`Valor recebido pós taxamento **NÃO É** pelo menos 70% maior que o valor pago pelo jogo: ${valorSimulacao.toFixed(4)} < ${(1.7 * valorPago).toFixed(4)}`);
            }

            if (valorSimulacao >= 1.5 * valorPago) {
              jogo.Messages.push(`Valor de Simulação é pelo menos 50% maior que Valor Pago: ${valorSimulacao.toFixed(4)} >= ${(1.5 * valorPago).toFixed(4)}`);
            } else {
              jogo.Messages.push(`Valor recebido pós taxamento **NÃO É** pelo menos 50% maior que o valor pago pelo jogo: ${valorSimulacao.toFixed(4)} < ${(1.5 * valorPago).toFixed(4)}`);
            }

            data.push(jogo);
            rowCount++;
          }
        }
      }
    });

    if (rowCount > 0) {
      console.log(`Quantidade de células preenchidas elegíveis na coluna 'C': ${rowCount}`);
      res.json(data);
    } else {
      console.log('Nenhuma célula preenchida elegível encontrada.');
      res.json({ message: 'Nenhuma célula preenchida elegível encontrada.', messages: [] });
    }
  });
};

module.exports = {
  catchFromSheet,
};
