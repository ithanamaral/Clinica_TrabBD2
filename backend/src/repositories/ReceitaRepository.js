const BaseRepository = require('./BaseRepository');

class ReceitaRepository extends BaseRepository {
    constructor() {
        super('receitas');
    }
}

module.exports = new ReceitaRepository();