const Usuario = require("./UsuarioModel");

class Medico extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, numero, uf, crm, especialidade, descricao) {
        super(nome, cpf, 'MEDICO', email, senha, dataNasc, endereco, numero);
        this.uf = uf;
        this.crm = crm;
        this.especialidade = especialidade;
        this.descricao = descricao;
    }
}

module.exports = Medico;