const { Router } = require('express');
const recepcionistaController = require('../controllers/AgendamentoController/RecepcionistaAgendamentoController');
const medicoController = require('../controllers/AgendamentoController/MedicoAgendamentoController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authRecepcionista');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/agendamento/recepcionista', auth, authRecep, recepcionistaController.create);
routes.get('/agendamento/recepcionista', auth, authRecep, recepcionistaController.list);
routes.get('/agendamento/recepcionista/buscar', auth, authRecep, recepcionistaController.select);
routes.put('/agendamento/recepcionista', auth, authRecep, recepcionistaController.update);
routes.delete('/agendamento/recepcionista', auth, authRecep, recepcionistaController.delete);
routes.get('/agendamento/medico', auth, authMedic, medicoController.list);
routes.get('/agendamento/medico/buscar', auth, authMedic, medicoController.select);
routes.put('/agendamento/medico', auth, authMedic, medicoController.update);



module.exports = routes;