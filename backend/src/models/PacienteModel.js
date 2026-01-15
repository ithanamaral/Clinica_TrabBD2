const Usuario = require("./UsuarioModel");

class Paciente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, numero, tipoSang) {
        super(nome, cpf, 'PACIENTE', email, senha, dataNasc, endereco, numero);
        this.tipoSang = tipoSang;
    }
}

module.exports = Paciente;