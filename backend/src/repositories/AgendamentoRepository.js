const BaseRepository = require('./BaseRepository');
const { ObjectId } = require('mongodb'); // Precisamos disso para buscar pelo ID do médico

class AgendamentoRepository extends BaseRepository {
    constructor() {
        super('agendamentos');
    }

    async findPendentes() {
        return await this.getDb().find({ status: true }).toArray();
    }

    // --- NOVA FUNÇÃO: Busca agenda do médico no dia ---
    async findByMedicoEData(id_medic, data) {
        return await this.getDb().find({ 
            id_medic: new ObjectId(id_medic), 
            data: data 
        }).toArray();
    }
}

module.exports = new AgendamentoRepository();