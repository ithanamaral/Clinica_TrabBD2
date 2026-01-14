const { Router } = require('express');
const ExameController = require('../controllers/ExamePedidoController/ExamePedidoController');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/exames', authMedic, ExameController.create);
routes.put('/exames', authMedic, ExameController.update);
routes.delete('/exames', authMedic, ExameController.delete);

routes.get('/exames', ExameController.list);
routes.get('/exames/buscar', ExameController.select);

module.exports = routes;