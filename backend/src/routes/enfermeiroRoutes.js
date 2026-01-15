const { Router } = require('express');
const EnfermeiroController = require('../controllers/EnfermeiroController/EnfermeiroController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authRecepcionista');

const routes = new Router();

routes.post('/enfermeiros', auth, authRecep, EnfermeiroController.create);
routes.get('/enfermeiros', auth, authRecep, EnfermeiroController.list);
routes.get('/enfermeiros/buscar', auth, authRecep, EnfermeiroController.select);
routes.put('/enfermeiros', auth, authRecep, EnfermeiroController.update);
routes.delete('/enfermeiros', auth, authRecep, EnfermeiroController.delete);

module.exports = routes;