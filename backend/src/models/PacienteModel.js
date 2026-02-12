const Usuario = require("./UsuarioModel");

class Paciente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, tipoSang) {
        super(nome, cpf, 'PACIENTE', email, senha, dataNasc, endereco, telefone);
        this.tipoSang = tipoSang;
    }
}

module.exports = Paciente;