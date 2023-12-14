const ExcelJS = require('exceljs');
const path = require('path');

async function saveAsHtml(filePath, outputHtmlPath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.resolve(__dirname, filePath));

  // Substitua 'Sheet1' pelo nome da planilha que deseja salvar como HTML
  const sheet = workbook.getWorksheet('BestbuyTrue.xlsx');

  // Defina as opções de salvamento como HTML
  const htmlOptions = {
    pageSetup: { fitToPage: true, orientation: 'portrait' },
    sheetFormat: { baseColWidth: 15, defaultColWidth: 15 },
  };

  // Salve a planilha como HTML
  await workbook.xlsx.writeFile(path.resolve(__dirname, outputHtmlPath), { ...htmlOptions, fileType: 'html' });
}

async function main() {
  try {
    const inputFilePath = 'BestbuyTrue.xlsx';
    const outputHtmlPath = 'BestbuyTrue.html';

    await saveAsHtml(inputFilePath, outputHtmlPath);

    console.log('Planilha salva como HTML com sucesso!');
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

main();
