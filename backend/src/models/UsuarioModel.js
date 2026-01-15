const bcryptjs = require('bcryptjs');

class Usuario {
    constructor(nome, cpf, tipoPerfil, email, senha, dataNasc, endereco, telefone) {
        this.nome = nome;
        this.cpf = cpf;
        this.tipoPerfil = tipoPerfil;
        this.email = email;
        this.senha = senha;
        this.dataNasc = dataNasc;
        this.data_cadastro = new Date();
        this.endereco = endereco;
        this.telefone = telefone;
    }

    async hashPassword() {
        this.senha = await bcryptjs.hash(this.senha, 8);
    }

    async passwordIsValid(password) {
        return await bcryptjs.compare(password, this.senha);
    }
}

module.exports = Usuario;