class Triagem {
    constructor(sinais_vitais, altura, peso, classificacao, descricao, 
        id_paci, id_enfer, id_agen  
    ) {
        this.sinais_vitais = sinais_vitais;
        this.altura = altura;
        this.peso = peso;
        this.classificacao = classificacao;
        this.descricao = descricao;
        this.id_paci = id_paci;
        this.id_enfer = id_enfer;
        this.id_agen = id_agen;
        this.data = new Date();
    }
}

module.exports = Triagem;