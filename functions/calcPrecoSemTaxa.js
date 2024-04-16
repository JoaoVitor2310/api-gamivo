const taxaGamivoPorcentagemMaiorIgual4 = Number(process.env.TAXA_GAMIVO_PORCENTAGEM_MAIORIGUAL_4);
const taxaGamivoFixoMaiorIgual4 = Number(process.env.TAXA_GAMIVO_FIXO_MAIORIGUAL_4);
const taxaGamivoPorcentagemMenorQue4 = Number(process.env.TAXA_GAMIVO_PORCENTAGEM_MENOR_QUE4);
const taxaGamivoFixoMenorQue4 = Number(process.env.TAXA_GAMIVO_FIXO_MENOR_QUE4);

const calcPrecoSemTaxa = (menorPreco) => {
    let menorPrecoSemTaxa;
    if (menorPreco < 4) {
          menorPrecoSemTaxa = (menorPreco - taxaGamivoFixoMenorQue4) / (1 + taxaGamivoPorcentagemMenorQue4);
    }
    else {
          menorPrecoSemTaxa = (menorPreco - taxaGamivoFixoMaiorIgual4) / (1 + taxaGamivoPorcentagemMaiorIgual4)
    }

    if (menorPrecoSemTaxa < 0) {
          menorPrecoSemTaxa = 0.01;
    }

    return menorPrecoSemTaxa;
}

module.exports = {
    calcPrecoSemTaxa
}