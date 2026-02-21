const Usuario = require("./UsuarioModel");

class Paciente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, tipoSang) {
        super(nome, cpf, 'PACIENTE', email, senha, dataNasc, endereco, telefone);
        this.tipoSang = tipoSang;
    }

    static validarPaciente(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.tipoSang) erros.push("O campo 'tipoSang' é obrigatório.");
        return erros;
    }
}

module.exports = Paciente;