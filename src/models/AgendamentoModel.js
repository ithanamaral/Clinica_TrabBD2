class Agendamento {
    constructor(data, descricao, status, horario, id_recep, id_medic, id_paci) {
        this.data = data;
        this.descricao = descricao;
        this.status = status;
        this.horario = horario;
        this.id_recep = id_recep;
        this.id_medic = id_medic;
        this.id_paci = id_paci;
        this.data_criacao = new Date();
    }
}

module.exports = Agendamento;