const taxaWholesale = Number(process.env.taxaWholesale);

const calcWholesaleSemTaxa = (menorPreco) => {
    let menorPrecoSemTaxa;
    menorPrecoSemTaxa = menorPreco / taxaWholesale;
    if (menorPrecoSemTaxa <= 0) {
        menorPrecoSemTaxa = 0.01;
    }

    return menorPrecoSemTaxa;
}

module.exports = {
    calcWholesaleSemTaxa
}