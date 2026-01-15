const BaseRepository = require('./BaseRepository');

class DispensaRepository extends BaseRepository {
    constructor() {
        super('dispensas');
    }
}

module.exports = new DispensaRepository();