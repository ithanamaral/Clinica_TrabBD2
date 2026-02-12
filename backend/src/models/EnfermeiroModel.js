const Usuario = require("./UsuarioModel");

class Enfermeiro extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, uf, coren) {
        super(nome, cpf, 'ENFERMEIRO', email, senha, dataNasc, endereco, telefone);
        this.uf = uf;
        this.coren = coren;
    }
}

module.exports = Enfermeiro;