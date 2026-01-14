const { Router } = require('express');
const ReceitaController = require('../controllers/ReceitaController/ReceitaController');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/receitas', authMedic, ReceitaController.create);
routes.put('/receitas', authMedic, ReceitaController.update);
routes.delete('/receitas', authMedic, ReceitaController.delete);

routes.get('/receitas', ReceitaController.list);
routes.get('/receitas/buscar', ReceitaController.select);

module.exports = routes;