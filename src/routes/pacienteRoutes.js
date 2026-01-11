const { Router } = require('express');
const PacienteController = require('../controllers/PacienteController/PacienteController');

const routes = new Router();

routes.post('/pacientes', PacienteController.create);
routes.get('/pacientes', PacienteController.list);
routes.get('/pacientes/buscar', PacienteController.select);
routes.delete('/pacientes', PacienteController.delete);

module.exports = routes;