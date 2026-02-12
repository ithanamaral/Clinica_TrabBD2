const express = require('express');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const enfermeiroRoutes = require('./routes/enfermeiroRoutes');
const recepcionistaRoutes = require('./routes/recepcionistaRoutes');
const agendamentoRoutes =  require('./routes/agendamentoRoutes');
const authRoutes = require('./routes/authRoutes');
const triagemRoutes =  require('./routes/triagemRoutes');
const evolucaoRoutes = require('./routes/evolucaoRoutes');
const receitaRoutes = require('./routes/receitaRoutes');
const exameRoutes = require('./routes/examePedidoRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const dispensaRoutes = require('./routes/dispensaRoutes');
const cors = require('cors');


class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
  }
  

  routes() {
    this.server.use(pacienteRoutes);
    this.server.use(medicoRoutes);
    this.server.use(enfermeiroRoutes);
    this.server.use(recepcionistaRoutes);
    this.server.use(agendamentoRoutes);
    this.server.use(authRoutes);
    this.server.use(triagemRoutes);
    this.server.use(evolucaoRoutes);
    this.server.use(receitaRoutes);
    this.server.use(exameRoutes);
    this.server.use(medicamentoRoutes);
    this.server.use(dispensaRoutes);
  }
}

module.exports = new App().server;