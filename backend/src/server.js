require('dotenv').config();
const app = require('./app');
const { connect } = require('./database'); 

const PORT = 3001;

async function start() {
  try {
    await connect(); 
    
    app.listen(PORT, () => {
      console.log(`\nServidor online!`);
      console.log(`Acesse: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Falha ao iniciar:", error);
  }
}

start();