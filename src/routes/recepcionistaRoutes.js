const { Router } = require('express');
const recepcionistaController = require('../controllers/RecepcionistaController/RecepcionistaController');

const routes = new Router();

routes.post('/recepcionistas', recepcionistaController.create);
routes.get('/recepcionistas', recepcionistaController.list);
routes.get('/recepcionistas/buscar', recepcionistaController.select);
routes.delete('/recepcionistas', recepcionistaController.delete);




module.exports = routes;