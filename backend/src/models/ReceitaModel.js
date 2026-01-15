class Receita {
    constructor(descricao, validade, emissao, id_medic, id_evolu, id_paci) {
        this.descricao = descricao;
        this.validade = validade;
        this.emissao = emissao;
        this.id_medic = id_medic;
        this.id_evolu = id_evolu;
        this.id_paci = id_paci;      
    }
}

module.exports = Receita;