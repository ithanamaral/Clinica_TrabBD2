const BaseRepository = require('./BaseRepository');

class AgendamentoRepository extends BaseRepository {
    constructor() {
        super('agendamentos');
    }

    async findPendentes() {
        return await this.getDb().find({ status: true }).toArray();
    }
}

module.exports = new AgendamentoRepository();