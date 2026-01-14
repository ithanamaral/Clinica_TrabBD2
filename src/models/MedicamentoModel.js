class Medicamento {
    constructor(nome, principio, qnt_disp, id_enfer) {
        this.nome = nome;
        this.principio = principio;
        this.qnt_disp = qnt_disp;
        this.id_enfer = id_enfer;
        this.data_cadastro = new Date();
    }
}

module.exports = Medicamento;