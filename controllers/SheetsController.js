const axios = require('axios');
const token = process.env.TOKEN;
const url = process.env.URL;
const nossaURL = process.env.NOSSAURL;
const ExcelJS = require('exceljs');
const path = require('path');

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
  const filePath = path.resolve(__dirname, '../testenaoaguentomais.xlsx');
  const sheetName = 'Venda-Chave-Troca';
  const workbook = new ExcelJS.Workbook();

  workbook.xlsx.readFile(path.resolve(__dirname, filePath)).then(() => {
    const sheet = workbook.getWorksheet(sheetName);
    const data = [];
    let rowCount = 0;

sheet.eachRow((row, rowNumber) => {
  if (rowNumber > 1) {
    const vendidoPorCell = row.getCell(5);
    const vendidoPelaGamivo = vendidoPorCell.value === 'Gamivo';

    const jogoHBCell = row.getCell(3);
    const coluna1Cell = row.getCell(1);
    const chaveRecebidaCell = row.getCell(2);
    const valorSimulacaoCell = row.getCell(9);
    const valorPagoCell = row.getCell(12);
    const valorSimulacao = extractFormulaResult(valorSimulacaoCell);
    const valorPago = parseFloat(valorPagoCell.value);
    const colunas2Cell = row.getCell(7);

    const jogo = {
      'Contador do Jogo': rowCount + 1,
      'Tipo de Chave': coluna1Cell.value,
      'Chave Recebida': chaveRecebidaCell.value,
      'Jogo HB': jogoHBCell.value,
      'Observação': row.getCell(4).value,
      'Vendido Por': vendidoPorCell.value,
      'Vendido Pela Gamivo': vendidoPelaGamivo ? 'Sim' : 'Não',
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

    data.push(jogo);
    rowCount++;
  }
});

    const response = {
      'Jogos': data
    };

    res.json(response);
  });
};

const colorsAnalyse = (req, res) => {
  const filePath = '../testenaoaguentomais.xlsx';
  const sheetName = 'Venda-Chave-Troca';

  const workbook = new ExcelJS.Workbook();

  workbook.xlsx.readFile(path.resolve(__dirname, filePath)).then(() => {
    const sheet = workbook.getWorksheet(sheetName);
    const analysisResult = analyzeColors(sheet);
    res.json(analysisResult);
  });
};

const analyzeColors = (sheet) => {
  let blackCount = 0;
  const data = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const chaveRecebidaCell = row.getCell(2);
      const jogoHBCell = row.getCell(3);
      const vendidoPorCell = row.getCell(5);

      if (chaveRecebidaCell.fill && jogoHBCell.fill) {
        const corChaveRecebida = chaveRecebidaCell.fill.fgColor;
        const corJogoHB = jogoHBCell.fill.fgColor;

        // Verifica se a cor é preta (#000000)
        if (corChaveRecebida && corJogoHB && corChaveRecebida.argb === 'FF000000' && corJogoHB.argb === 'FF000000') {
          if (vendidoPorCell.value === 'Gamivo') {
            blackCount++;
          }
        }
      }
    }
  });

  const response = {
    'Quantidade de jogos que ainda não foram vendidos pela Gamivo': blackCount,
    'Jogos': data,
  };

  return response;
};




module.exports = {
  catchFromSheet,
  colorsAnalyse,
};
