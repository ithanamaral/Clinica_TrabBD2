class Endereco {
    constructor(cidade, bairro, rua, cep, numero) {
        this.cidade = cidade;
        this.bairro = bairro;
        this.rua = rua;
        this.cep = cep;
        this.numero = numero;
    }

    static validarEndereco(endereco) {
        const erros = [];
        if (!endereco) { erros.push("O campo 'endereço' é obrigatório."); return erros; }
        if (!endereco.cidade) erros.push("O campo 'cidade' é obrigatório.");
        if (!endereco.bairro) erros.push("O campo 'bairro' é obrigatório.");
        if (!endereco.rua) erros.push("O campo 'rua' é obrigatório.");
        if (!endereco.cep) erros.push("O campo 'cep' é obrigatório.");
        if (!endereco.numero) erros.push("O campo 'numero' é obrigatório.");
        return erros;
    }
    

}
module.exports = Endereco; 