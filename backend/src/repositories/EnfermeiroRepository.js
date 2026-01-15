const BaseRepository = require('./BaseRepository');

class EnfermeiroRepository extends BaseRepository {
    constructor() {
        super('enfermeiros');
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

module.exports = new EnfermeiroRepository();