const { Router } = require('express');
const EvolucaoController = require('../controllers/EvolucaoController/EvolucaoController');
const auth = require('../middlewares/auth');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/evolucao', auth, authMedic, EvolucaoController.create);
routes.put('/evolucao', auth, authMedic, EvolucaoController.update);
routes.delete('/evolucao', auth, authMedic, EvolucaoController.delete);
routes.get('/evolucao', auth, authMedic, EvolucaoController.list);
routes.get('/evolucao/buscar', auth, authMedic, EvolucaoController.select);

module.exports = routes;