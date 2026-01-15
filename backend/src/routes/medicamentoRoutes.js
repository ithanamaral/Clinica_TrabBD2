const { Router } = require('express');
const MedicamentoController = require('../controllers/MedicamentoController/MedicamentoController');
const auth = require('../middlewares/auth');
const authEnfer = require('../middlewares/authEnfermeiro');

const routes = new Router();

routes.post('/medicamentos', auth, authEnfer, MedicamentoController.create);
routes.put('/medicamentos', auth, authEnfer, MedicamentoController.update);
routes.delete('/medicamentos', auth, authEnfer, MedicamentoController.delete);
routes.post('/medicamentos/dispensar', auth, authEnfer, MedicamentoController.dispensar);
routes.get('/medicamentos', auth, authEnfer, MedicamentoController.list);
routes.get('/medicamentos/buscar', auth, authEnfer, MedicamentoController.select);

module.exports = routes;