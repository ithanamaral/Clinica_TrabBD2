const BaseRepository = require('./BaseRepository');

class ExamePedidoRepository extends BaseRepository {
    constructor() {
        super('exames');
    }
}

module.exports = new ExamePedidoRepository();