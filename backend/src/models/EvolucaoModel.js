class Evolucao {
    constructor(resumo, cid_prin, cid_secun, id_medic, id_paci) {
        this.resumo = resumo;
        this.cid_prin = cid_prin;
        this.cid_secun = cid_secun;
        this.id_medic = id_medic;
        this.id_paci = id_paci;   
        this.data = new Date();
    }
}

module.exports = Evolucao;