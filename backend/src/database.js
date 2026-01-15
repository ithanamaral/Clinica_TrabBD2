const {MongoClient, ServerApiVersion} = require('mongodb')
require('dotenv').config();

let dbInstance = null;

const client = new MongoClient(process.env.CONNECTIONSTRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
    
async function connect() {
    if (dbInstance) return dbInstance;

    try {
        await client.connect();
        console.log("Conectado ao MongoDB!");
        
        dbInstance = client.db("Clinica")

    } catch (error) {
        console.error("Erro ao conectar!");
        console.error(error);
        process.exit(1);
    }
}

function getDb() {
    if (!dbInstance) throw new Error("Banco não inicializado");
    return dbInstance;
}

module.exports = {connect, getDb};