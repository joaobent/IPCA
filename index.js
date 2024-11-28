import express from "express";
import { pesquisarTodaLista, consultarAno, buscarIpcaPorId, calcularValor } from "./servicos/servicos.js";
import historicoInflacao from "./dados/dados.js";

const app = express();

app.get("/historicoIPCA/", (req, res) => {
    var resultado;
    const anoInformado = parseInt(req.query.ano);
    //Tratamento de erro
    if (isNaN(parseInt(req.query.ano))) {
        if (req.query.ano === undefined) {
            resultado = pesquisarTodaLista();
            res.json(resultado)
        } else {
            res.status(400).json({ erro: "Este parâmetro é inválido." });
        }
        

    } else if (anoInformado < 2015 || anoInformado > 2024) {
        res.status(404).json({ erro: "Nenhum histórico encontrato para o ano especificado" });
    } else {
        resultado = consultarAno(anoInformado);
        res.json(resultado)
    }
});


app.get("/historicoIPCA/calculo/", (req, res) => {
    const valor = parseFloat(req.query.valor);
    const mesInicial = parseInt(req.query.mesInicial);
    const anoInicial = parseInt(req.query.anoInicial);
    const mesFinal = parseInt(req.query.mesFinal);
    const anoFinal = parseInt(req.query.anoFinal);

    //Tratamento de erro
    if (isNaN(valor) || isNaN(mesInicial) || isNaN(anoInicial) || isNaN(mesFinal) || isNaN(anoFinal)) {
        return res.status(400).json({ erro: "Parâmetros inválidos" });
    } else if (anoInicial > anoFinal || anoInicial == anoFinal && mesInicial > mesFinal) {
        return res.status(400).json({ erro: "Parâmetros inválidos" });
    } else if (anoInicial < 2015 || anoFinal > 2024 || mesInicial < 1 || mesFinal > 12) {
        return res.status(400).json({ erro: "Parâmetros inválidos" });
    }
    const resultado = calcularValor(valor, mesInicial, anoInicial, mesFinal, anoFinal);

    res.json({ resultado: resultado })
});

app.get("/historicoIPCA/:id", (req, res) => {
    const idIpca = parseInt(req.params.id);
    if (isNaN(parseInt(idIpca)) || idIpca > historicoInflacao.length || idIpca < 1) {
        res.status(400).json({ erro: "Elemento não encontrado" })
    } else {
        res.json(buscarIpcaPorId(idIpca));
    }
});

//Tratamento de erro
app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint não encontrado" });
});


const data = Date();
app.listen(8080, () => {
    console.log("Servidor iniciado com sucesso na porta 8080 em", data);
});