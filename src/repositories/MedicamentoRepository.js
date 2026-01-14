const BaseRepository = require('./BaseRepository');
const { ObjectId } = require('mongodb');

class MedicamentoRepository extends BaseRepository {
    constructor() {
        super('medicamentos');
    }

    async diminuirEstoque(id, qnt) {
        const db = this.getDb();
        return await db.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { qnt_disp: -qnt } }
        );
    }
}

module.exports = new MedicamentoRepository();