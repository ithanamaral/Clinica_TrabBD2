const Usuario = require("./UsuarioModel");

class Enfermeiro extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, numero, uf, coren) {
        super(nome, cpf, 'ENFERMEIRO', email, senha, dataNasc, endereco, numero);
        this.uf = uf;
        this.coren = coren;
    }
}

module.exports = Enfermeiro;