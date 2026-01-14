const { Router } = require('express');
const DispensaController = require('../controllers/DispensaController/DispensaController');
const authEnfer = require('../middlewares/authEnfermeiro'); // Apenas enfermagem audita

const routes = new Router();

routes.get('/dispensas', DispensaController.list);
routes.get('/dispensas/buscar', authEnfer, DispensaController.select);

module.exports = routes;