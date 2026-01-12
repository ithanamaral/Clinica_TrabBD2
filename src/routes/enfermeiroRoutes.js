const { Router } = require('express');
const EnfermeiroController = require('../controllers/EnfermeiroController/EnfermeiroController');
const authRecep = require('../middlewares/authRecepcionista');

const routes = new Router();

routes.post('/enfermeiros', EnfermeiroController.create);
routes.get('/enfermeiros', EnfermeiroController.list);
routes.get('/enfermeiros/buscar', EnfermeiroController.select);
routes.put('/enfermeiros', authRecep, EnfermeiroController.update);
routes.delete('/enfermeiros', EnfermeiroController.delete);

module.exports = routes;