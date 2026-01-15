const Usuario = require("./UsuarioModel");

class Recepcionista extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, numero, turno) {
        super(nome, cpf, 'RECEPCIONISTA', email, senha, dataNasc, endereco, numero);
        this.turno = turno;
    }
}

module.exports = Recepcionista;