const Usuario = require("./UsuarioModel");

class Admin extends Usuario {
    constructor(nome, cpf, email, senha) {
        super(nome, cpf, 'ADMIN', email, senha, null, null, null);
    }
}

module.exports = Admin;