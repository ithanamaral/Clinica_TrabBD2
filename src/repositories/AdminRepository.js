const BaseRepository = require('./BaseRepository');

class AdminRepository extends BaseRepository {
    constructor() {
        super('admins'); 
    }
    
    async findByEmail(email) {
        return await this.getDb().findOne({ email });
    }
}

module.exports = new AdminRepository();