const bcryptjs = require('bcryptjs');
const Endereco = require('./EnderecoModel');

class Usuario {
    constructor(nome, cpf, tipoPerfil, email, senha, dataNasc, enderecoData, telefone) {
        this.nome = nome;
        this.cpf = cpf;
        this.tipoPerfil = tipoPerfil;
        this.email = email;
        this.senha = senha;
        this.dataNasc = dataNasc;
        this.data_cadastro = new Date();
        this.telefone = telefone;
        if(enderecoData) {
            this.endereco = new Endereco(
                enderecoData.cidade,
                enderecoData.bairro,
                enderecoData.rua,
                enderecoData.cep,
                enderecoData.numero
            )
        } else {
            this.endereco = null;
        }
    }

    async hashPassword() {
        this.senha = await bcryptjs.hash(this.senha, 8);
    }

    async passwordIsValid(password) {
        return await bcryptjs.compare(password, this.senha);
    }
}

module.exports = Usuario;