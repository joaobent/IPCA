import historicoInflacao from "../dados/dados.js";

export const pesquisarTodaLista = () => {
    return historicoInflacao;
};

export const consultarAno = (anoInformado) => {
    const ano = anoInformado;
    return historicoInflacao.filter(ipca => ipca.ano == ano);
};

export const buscarIpcaPorId = (id) => {
    const idIpca = parseInt(id);
    return historicoInflacao.filter(ipca => ipca.id == idIpca);
};

export const calcularValor = (valor, mesInicial, anoInicial, mesFinal, anoFinal) => {
    // Filtra o histórico de inflação com base nos parâmetros fornecidos
    const listaIpca = historicoInflacao.filter((ipca) => {
        return (
            (ipca.ano === anoInicial && ipca.mes >= mesInicial) ||
            (ipca.ano > anoInicial && ipca.ano < anoFinal) ||
            (ipca.ano === anoFinal && ipca.mes <= mesFinal)
        );
    });

    // Inicializa o resultado com o valor inicial
    let resultado = valor;

    // Calcula o resultado com base nos valores de IPCA filtrados
    listaIpca.forEach(ipca => {
        resultado *= (1 + (ipca.ipca / 100));
    });
    let valorArrendondado = parseFloat(resultado.toFixed(2))
    return valorArrendondado;
};