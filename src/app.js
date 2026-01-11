const express = require('express');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const enfermeiroRoutes = require('./routes/enfermeiroRoutes');
const recepcionistaRoutes = require('./routes/recepcionistaRoutes');

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
  }
}

module.exports = new App().server;