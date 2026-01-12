const { Router } = require('express');
const agendamentoController = require('../controllers/RecepcionistaController/AgendamentoController');
const authRecep = require('../middlewares/authRecepcionista');

const routes = new Router();

routes.post('/agendamento', authRecep, agendamentoController.create);
routes.get('/agendamento', agendamentoController.list);
routes.get('/agendamento/buscar', agendamentoController.select);
routes.put('/agendamento', authRecep, agendamentoController.update);
routes.delete('/agendamento', agendamentoController.delete);


module.exports = routes;