const { Router } = require('express');
const EvolucaoController = require('../controllers/EvolucaoController/EvolucaoController');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/evolucao', authMedic, EvolucaoController.create);
routes.put('/evolucao', authMedic, EvolucaoController.update);
routes.delete('/evolucao', authMedic, EvolucaoController.delete);

routes.get('/evolucao', EvolucaoController.list);
routes.get('/evolucao/buscar', EvolucaoController.select);

module.exports = routes;