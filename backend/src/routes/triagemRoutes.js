const { Router } = require('express');
const enfermeiroController = require('../controllers/TriagemController/EnfermeiroTriagemController');
const medicoController = require('../controllers/TriagemController/MedicoTriagemController');
const auth = require('../middlewares/auth');
const authEnfer = require('../middlewares/authEnfermeiro');
const authMedic = require('../middlewares/authMedico');

const routes = new Router();

routes.post('/triagem/enfermeiro', auth, authEnfer, enfermeiroController.create);
routes.get('/triagem/enfermeiro', auth, authEnfer, enfermeiroController.list);
routes.get('/triagem/enfermeiro/buscar', auth, authEnfer, enfermeiroController.select);
routes.put('/triagem/enfermeiro', auth, authEnfer, enfermeiroController.update);
routes.delete('/triagem/enfermeiro', auth, authEnfer, enfermeiroController.delete);
routes.get('/triagem/medico', auth, authMedic, medicoController.list);
routes.get('/triagem/medico/buscar', auth, authMedic, medicoController.select);
routes.put('/triagem/medico', auth, authMedic, medicoController.update);



module.exports = routes;