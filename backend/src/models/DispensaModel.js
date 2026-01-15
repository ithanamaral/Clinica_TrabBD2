class Dispensa {
    constructor(id_medicam, id_paci, id_enfer, quantidade) {
        this.id_medicam = id_medicam;
        this.id_paci = id_paci;
        this.id_enfer = id_enfer;
        this.quantidade = quantidade;
        this.data = new Date();
    }
}

module.exports = Dispensa;