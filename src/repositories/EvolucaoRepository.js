const BaseRepository = require('./BaseRepository');

class EvolucaoRepository extends BaseRepository {
    constructor() {
        super('evolucoes');
    }
}

module.exports = new EvolucaoRepository();