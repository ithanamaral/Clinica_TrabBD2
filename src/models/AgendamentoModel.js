class Agendamento {
    constructor(data, descricao, status, horario, id_recep, id_medic, id_paci) {
        this.data = data;
        this.descricao = descricao;
        this.status = status;
        this.horario = horario;
        this.recep_id = id_recep;
        this.medic_id = id_medic;
        this.paci_id = id_paci;
    }
}

module.exports = Agendamento;