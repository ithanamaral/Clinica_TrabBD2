const Recepcionista = require('../../models/RecepcionistaModel');
const Endereco = require('../../models/EnderecoModel');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, turno } = req.body;
            const erros = [];
            
            const usuarioExistente = await RecepcionistaRepo.findByCpfOrEmail(cpf, email);
            
            if (usuarioExistente) {
                if (usuarioExistente.cpf === cpf) erros.push("O CPF já existe no sistema.");
                if (usuarioExistente.email === email) erros.push("O e-mail já existe no sistema.");
            }
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (endereco) {
                const errosEndereco = Endereco.validarEndereco(endereco);
                if (errosEndereco.length > 0) erros.push(...errosEndereco);
            }
            if (telefone && typeof telefone !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (!turno) erros.push("O campo 'turno' é obrigatório.");
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const recepcionista = new Recepcionista(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                telefone,
                turno
            );

            await recepcionista.hashPassword();

            const resultado = await RecepcionistaRepo.create(recepcionista);

            res.status(201).json({
                mensagem: "Recepcionista cadastrado!",
                id_recep: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const recepcionistas = await RecepcionistaRepo.findAll();
            res.json(recepcionistas);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const recepcionista = await RecepcionistaRepo.findById(id);
            if (!recepcionista) return res.status(404).json({erro: "Recepcionista não encontrado"});

            res.status(200).json(recepcionista);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await RecepcionistaRepo.delete(id);

            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Recepcionista não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Recepcionista deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}