const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class BaseRepository {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    getDb() {
        return getDb().collection(this.collectionName);
    }

    async create(item) {
        return await this.getDb().insertOne(item);
    }

    async findAll() {
        return await this.getDb().find({}).toArray();
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) return null;
        return await this.getDb().findOne({ _id: new ObjectId(id) });
    }

    async update(id, dados) {
        if (!ObjectId.isValid(id)) return null;
        return await this.getDb().updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) return null;
        return await this.getDb().deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = BaseRepository;