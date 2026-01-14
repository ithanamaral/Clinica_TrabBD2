class ExamePedido {
    constructor(status, arq_resultado, tipo_exame, id_medic, id_evolu, id_paci) {
        this.status = status;
        this.arq_resultado = arq_resultado;
        this.tipo_exame = tipo_exame;
        this.id_medic = id_medic;
        this.id_evolu = id_evolu;
        this.id_paci = id_paci;
        this.data = new Date();
    }
}

module.exports = ExamePedido;