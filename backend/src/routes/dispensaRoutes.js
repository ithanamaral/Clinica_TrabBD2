const { Router } = require('express');
const DispensaController = require('../controllers/DispensaController/DispensaController');
const auth = require('../middlewares/auth');
const authEnfer = require('../middlewares/authEnfermeiro');

const routes = new Router();

routes.get('/dispensas', auth, authEnfer, DispensaController.list);
routes.get('/dispensas/buscar', auth, authEnfer, DispensaController.select);

module.exports = routes;