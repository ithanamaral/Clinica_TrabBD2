const { Router } = require('express');
const MedicoController = require('../controllers/MedicoController/MedicoController');

const routes = new Router();

routes.post('/medicos', MedicoController.create);
routes.get('/medicos', MedicoController.list);
routes.get('/medicos/buscar', MedicoController.select);
routes.delete('/medicos', MedicoController.delete);

module.exports = routes;