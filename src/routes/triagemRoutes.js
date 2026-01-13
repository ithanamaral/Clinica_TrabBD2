const { Router } = require('express');
const enfermeiroController = require('../controllers/TriagemController/EnfermeiroTriagemController');
const medicoController = require('../controllers/TriagemController/MedicoTriagemController');
const authEnfer = require('../middlewares/authEnfermeiro');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/triagem/enfermeiro', authEnfer, enfermeiroController.create);
routes.get('/triagem/enfermeiro', enfermeiroController.list);
routes.get('/triagem/enfermeiro/buscar', enfermeiroController.select);
routes.put('/triagem/enfermeiro', authEnfer, enfermeiroController.update);
routes.delete('/triagem/enfermeiro', enfermeiroController.delete);


routes.get('/triagem/medico', medicoController.list);
routes.get('/triagem/medico/buscar', medicoController.select);
routes.put('/triagem/medico', authMedic, medicoController.update);



module.exports = routes;