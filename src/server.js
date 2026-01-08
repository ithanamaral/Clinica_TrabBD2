require('dotenv').config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());

const uri = process.env.CONNECTIONSTRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    console.log("Tentando conectar...");
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Conectado com sucesso ao MongoDB");
    
    const db = client.db("ProntFlexDB"); 

    app.listen(3000, () => {
      console.log(`Servidor rodando na porta 3000`);
    });

  } catch (error) {
    console.error("Erro ao conectar:");
    console.error(error);
    
    process.exit(1);
  }
}

startServer();