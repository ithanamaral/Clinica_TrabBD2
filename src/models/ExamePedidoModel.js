class ExamePedido {
    constructor(status, arq_resultado) {
        this.status = status;
        this.arq_resultado = arq_resultado;
        this.data = new Date();
    }
}

module.exports = ExamePedido;