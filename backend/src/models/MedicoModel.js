const Usuario = require("./UsuarioModel");

class Medico extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, uf, crm, especialidade, descricao) {
        super(nome, cpf, 'MEDICO', email, senha, dataNasc, endereco, telefone);
        this.uf = uf;
        this.crm = crm;
        this.especialidade = especialidade;
        this.descricao = descricao;
    }

    static validarMedico(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.especialidade) erros.push("O campo 'especialidade' é obrigatório.");
        if (!dados.descricao) erros.push("O campo 'descricao' é obrigatório.");
        if (!dados.uf) erros.push("O campo 'UF' é obrigatório.");
        if (!dados.crm && typeof crm !== 'number' && typeof dados.crm !== 'string') {
            erros.push("CRM inválida.");
        }
        return erros;
    }
}

module.exports = Medico;