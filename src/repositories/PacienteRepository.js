const BaseRepository = require('./BaseRepository');

class PacienteRepository extends BaseRepository {
    constructor() {
        super('pacientes');
    }

    async findByCpfOrEmail(cpf, email) {
        return await this.getDb().findOne({
            $or: [{ cpf }, { email }]
        });
    }
    
    async findByEmail(email) {
        return await this.getDb().findOne({ email });
    }
}

module.exports = new PacienteRepository();