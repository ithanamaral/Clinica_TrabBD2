const BaseRepository = require('./BaseRepository');

class RecepcionistaRepository extends BaseRepository {
    constructor() {
        super('recepcionistas');
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

module.exports = new RecepcionistaRepository();