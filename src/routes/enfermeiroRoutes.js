const { Router } = require('express');
const EnfermeiroController = require('../controllers/EnfermeiroController/EnfermeiroController');

const routes = new Router();


routes.post('/enfermeiros', EnfermeiroController.create);
routes.get('/enfermeiros', EnfermeiroController.list);
routes.get('/enfermeiros/buscar', EnfermeiroController.select);
routes.delete('/enfermeiros', EnfermeiroController.delete);

module.exports = routes;