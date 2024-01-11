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
    return 'True'; // Vermelho
  } else if (corArgb === 'FFFFFF00') {
    return 'False'; // Amarelo
  } else if (corArgb === 'FF000000') {
    return 'Ainda não posto a venda'; // Preto
  }

  return 'Nenhuma cor encontrada';
};

const extractFormulaResult = (cell) => {
  if (cell.formula) {
    try {
      return cell.value.result;
    } catch (error) {
      return 'Erro ao avaliar a fórmula';
    }
  }
  return cell.value;
};

const catchFromSheet = (req, res) => {
  const filePath = '../BestbuyTrue.xlsx';
  const sheetName = 'Venda-Chave-Troca';

  const workbook = new ExcelJS.Workbook();

  workbook.xlsx.readFile(path.resolve(__dirname, filePath)).then(() => {
    const sheet = workbook.getWorksheet(sheetName);
    const data = [];
    let rowCount = 0;
    let redCount = 0;
    let yellowCount = 0;
    let blackCount = 0;

    sheet.eachRow((row, rowNumber) => {
      const jogoHBCell = row.getCell(3);

      if (jogoHBCell.value) {
        const corCelula = jogoHBCell.fill ? jogoHBCell.fill.fgColor : null;

        if (corCelula && (corCelula.argb === 'FFFF0000' || corCelula.argb === 'FFFFFF00' || corCelula.argb === 'FF000000')) {
          const coluna1Cell = row.getCell(1);
          const vendidoPorCell = row.getCell(5);
          const chaveRecebidaCell = row.getCell(2);
          const valorSimulacaoCell = row.getCell(9);
          const valorPagoCell = row.getCell(12);

          if (coluna1Cell.value.includes('RK') && vendidoPorCell.value === 'Gamivo') {
            const valorSimulacao = extractFormulaResult(valorSimulacaoCell);
            const valorPago = parseFloat(valorPagoCell.value);

            const colunas2Cell = row.getCell(7);

            const jogo = {
              'Contador do Jogo': rowCount + 1,
              'Chave Recebida': chaveRecebidaCell.value,
              'Foi Vendido? ': determineStatus(corCelula.argb, vendidoPorCell.value),
              'Jogo HB': jogoHBCell.value,
              'Observação': row.getCell(4).value,
              'Vendido Por': vendidoPorCell.value,
              'Valor G2A': row.getCell(6).value,
              'Colunas2': {
                result: extractFormulaResult(colunas2Cell),
              },
              'V.R. (Real)': valorSimulacao,
              'V. R. (Simulação)': extractFormulaResult(row.getCell(9)),
              'Chave Entregue': row.getCell(10).value,
              'Jogo Entregue': row.getCell(11).value,
              'Valor Pago': valorPago,
              'Valor Mín. Venda': row.getCell(13).value,
              'Vendido': row.getCell(14).value,
              'Leilões/Mudanças de Preço': row.getCell(15).value,
              'Qtd': row.getCell(16).value,
              'Devoluções': row.getCell(17).value,
              'Receita (R$)': extractFormulaResult(row.getCell(18)),
              'Lucro (%)': extractFormulaResult(row.getCell(19)),
              'Data Adquirida': row.getCell(20).value instanceof Date ? row.getCell(20).value.toLocaleDateString() : null,
              'Data Venda': row.getCell(21).value instanceof Date ? row.getCell(21).value.toLocaleDateString() : null,
              'Data Vendida': row.getCell(22).value instanceof Date ? row.getCell(22).value.toLocaleDateString() : null,
              'Perfil/Origem': row.getCell(23).value,
              'E-mail cliente': row.getCell(24).value,
              'Comissão': extractFormulaResult(row.getCell(25)),
              'Messages': [] // Adiciona a propriedade 'Messages' para armazenar mensagens
            };

            if (corCelula.argb === 'FFFF0000') {
              redCount++;
            } else if (corCelula.argb === 'FFFFFF00') {
              yellowCount++;
            } else if (corCelula.argb === 'FF000000') {
              blackCount++;
            }

            if (valorSimulacao >= 1.7 * valorPago) {
              jogo.Messages.push(`Valor de Simulação é pelo menos 70% maior que Valor Pago: ${valorSimulacao.toFixed(3)} >= ${(1.7 * valorPago).toFixed(3)}`);
            } else {
              jogo.Messages.push(`Valor recebido pós taxamento **NÃO É** pelo menos 70% maior que o valor pago pelo jogo: ${valorSimulacao.toFixed(3)} < ${(1.7 * valorPago).toFixed(3)}`);
            
              // Verifica a condição de 50% apenas se não atender à condição de 70%
              if (valorSimulacao >= 1.5 * valorPago) {
                jogo.Messages.push(`Valor de Simulação é pelo menos 50% maior que Valor Pago: ${valorSimulacao.toFixed(3)} >= ${(1.5 * valorPago).toFixed(3)}`);
              } else {
                jogo.Messages.push(`Valor recebido pós taxamento **NÃO É** pelo menos 50% maior que o valor pago pelo jogo: ${valorSimulacao.toFixed(3)} < ${(1.5 * valorPago).toFixed(3)}`);
              }
            }
            
            data.push(jogo);
            rowCount++;
          }
        }
      }
    });

    const response = {
      'Quantidade de jogos ofertados pela Gamivo': rowCount,
      'Quantidade de jogos vendidos pela Gamivo:': redCount,
      'Quantidade de jogos da Gamivo ainda não postos a venda:': yellowCount,
      'Quantidade de jogos que ainda não foram vendidos pela Gamivo': blackCount,
      'Jogos': data
    };

    if (rowCount > 0) {
      console.log(`Quantidade de jogos ofertados pela Gamivo: ${rowCount}`);
      console.log(`Quantidade de jogos vendidos pela Gamivo: ${redCount}`);
      console.log(`Quantidade de jogos da Gamivo ainda não postos a venda: ${yellowCount}`);
      console.log(`Quantidade de jogos que ainda não foram vendidos pela Gamivo: ${blackCount}`);
      res.json(response);
    } else {
      console.log('Nenhuma jogo ofertado pela Gamivo encontrado.');
      res.json({ message: 'Nenhuma jogo ofertado pela Gamivo encontrado.', messages: [] });
    }
  });
};

module.exports = {
  catchFromSheet,
};
