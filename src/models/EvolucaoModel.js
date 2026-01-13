class Evolucao {
    constructor(resumo, cid_prin, cid_secun ) {
        this.resumo = resumo;
        this.cid_prin = cid_prin;
        this.cid_secun = cid_secun;
        this.data = new Date();
    }
}

module.exports = Evolucao;