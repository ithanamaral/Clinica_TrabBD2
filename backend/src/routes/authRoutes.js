const { Router } = require('express');
const authController = require('../controllers/authController');

const routes = new Router();

routes.post('/login', authController.login);


module.exports = routes;