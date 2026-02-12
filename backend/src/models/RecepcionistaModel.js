const Usuario = require("./UsuarioModel");

class Recepcionista extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, turno) {
        super(nome, cpf, 'RECEPCIONISTA', email, senha, dataNasc, endereco, telefone);
        this.turno = turno;
    }
}

module.exports = Recepcionista;