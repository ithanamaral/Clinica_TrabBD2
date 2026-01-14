const { Router } = require('express');
const MedicamentoController = require('../controllers/MedicamentoController/MedicamentoController');
const authEnfer = require('../middlewares/authEnfermeiro');

const routes = new Router();

routes.post('/medicamentos', authEnfer, MedicamentoController.create);
routes.put('/medicamentos', authEnfer, MedicamentoController.update);
routes.delete('/medicamentos', authEnfer, MedicamentoController.delete);
routes.post('/medicamentos/dispensar', authEnfer, MedicamentoController.dispensar);
routes.get('/medicamentos', MedicamentoController.list);
routes.get('/medicamentos/buscar', MedicamentoController.select);

module.exports = routes;