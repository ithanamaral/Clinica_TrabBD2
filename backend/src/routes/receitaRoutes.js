const { Router } = require('express');
const ReceitaController = require('../controllers/ReceitaController/ReceitaController');
const auth = require('../middlewares/auth');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/receitas', auth, authMedic, ReceitaController.create);
routes.put('/receitas', auth, authMedic, ReceitaController.update);
routes.delete('/receitas', auth, authMedic, ReceitaController.delete);
routes.get('/receitas', auth, authMedic, ReceitaController.list);
routes.get('/receitas/buscar', auth, authMedic, ReceitaController.select);

module.exports = routes;