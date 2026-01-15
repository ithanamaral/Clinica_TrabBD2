const { Router } = require('express');
const ExameController = require('../controllers/ExamePedidoController/ExamePedidoController');
const auth = require('../middlewares/auth');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/exames', auth, authMedic, ExameController.create);
routes.put('/exames', auth, authMedic, ExameController.update);
routes.delete('/exames', auth, authMedic, ExameController.delete);
routes.get('/exames', auth, authMedic, ExameController.list);
routes.get('/exames/buscar', auth, authMedic, ExameController.select);

module.exports = routes;