const express = require('express');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const enfermeiroRoutes = require('./routes/enfermeiroRoutes');
const recepcionistaRoutes = require('./routes/recepcionistaRoutes');
const agendamentoRoutes =  require('./routes/agendamentoRoute')
const authRoutes = require('./routes/authRoute');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(pacienteRoutes);
    this.server.use(medicoRoutes);
    this.server.use(enfermeiroRoutes);
    this.server.use(recepcionistaRoutes);
    this.server.use(agendamentoRoutes);
    this.server.use(authRoutes);
  }
}

module.exports = new App().server;