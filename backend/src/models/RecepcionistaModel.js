const Usuario = require("./UsuarioModel");

class Recepcionista extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, turno) {
        super(nome, cpf, 'RECEPCIONISTA', email, senha, dataNasc, endereco, telefone);
        this.turno = turno;
    }

    static validarRecepcionista(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.turno) erros.push("O campo 'turno' é obrigatório.");
        return erros;
    }
}

module.exports = Recepcionista;