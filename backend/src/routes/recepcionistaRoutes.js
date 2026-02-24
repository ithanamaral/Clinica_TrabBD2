const { Router } = require('express');
const recepcionistaController = require('../controllers/RecepcionistaController/RecepcionistaController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authRecepcionista');

const routes = new Router();

routes.post('/recepcionistas', recepcionistaController.create);
routes.get('/recepcionistas', auth, authRecep, recepcionistaController.list);
routes.get('/recepcionistas/buscar', auth, authRecep, recepcionistaController.select);
routes.put('/recepcionistas', auth, authRecep, recepcionistaController.update);
routes.delete('/recepcionistas', auth, authRecep, recepcionistaController.delete);

module.exports = routes;