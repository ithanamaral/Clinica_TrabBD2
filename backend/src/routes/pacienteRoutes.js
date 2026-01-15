const { Router } = require('express');
const PacienteController = require('../controllers/PacienteController/PacienteController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authRecepcionista');

const routes = new Router();

routes.post('/pacientes', auth, authRecep, PacienteController.create);
routes.get('/pacientes', auth, authRecep, PacienteController.list);
routes.get('/pacientes/buscar', auth, authRecep, PacienteController.select);
routes.put('/pacientes', auth, authRecep, PacienteController.update);
routes.delete('/pacientes', auth, authRecep, PacienteController.delete);

module.exports = routes;