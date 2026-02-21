const Usuario = require("./UsuarioModel");

class Enfermeiro extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, uf, coren) {
        super(nome, cpf, 'ENFERMEIRO', email, senha, dataNasc, endereco, telefone);
        this.uf = uf;
        this.coren = coren;
    }

    static validarEnfermeiro(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.uf) erros.push("O campo 'uf' é obrigatório.");
        if (!dados.coren && typeof dados.coren !== 'number') {
                erros.push("COREN inválida.");
            }
        return erros;
    }
}

module.exports = Enfermeiro;