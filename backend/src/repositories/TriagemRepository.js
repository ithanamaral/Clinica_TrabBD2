const BaseRepository = require('./BaseRepository');

class TriagemRepository extends BaseRepository {
    constructor() {
        super('triagens');
    }
}

module.exports = new TriagemRepository();