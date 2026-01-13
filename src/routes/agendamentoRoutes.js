const { Router } = require('express');
const recepcionistaController = require('../controllers/AgendamentoController/RecepcionistaAgendamentoController');
const medicoController = require('../controllers/AgendamentoController/MedicoAgendamentoController');
const authRecep = require('../middlewares/authRecepcionista');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/agendamento/recepcionista', authRecep, recepcionistaController.create);
routes.get('/agendamento/recepcionista', recepcionistaController.list);
routes.get('/agendamento/recepcionista/buscar', recepcionistaController.select);
routes.put('/agendamento/recepcionista', authRecep, recepcionistaController.update);
routes.delete('/agendamento/recepcionista', recepcionistaController.delete);


routes.get('/agendamento/medico', medicoController.list);
routes.get('/agendamento/medico/buscar', medicoController.select);
routes.put('/agendamento/medico', authMedic, medicoController.update);



module.exports = routes;