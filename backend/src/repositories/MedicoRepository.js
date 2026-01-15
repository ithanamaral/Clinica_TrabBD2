const BaseRepository = require('./BaseRepository');

class MedicoRepository extends BaseRepository {
    constructor() {
        super('medicos');
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

module.exports = new MedicoRepository();