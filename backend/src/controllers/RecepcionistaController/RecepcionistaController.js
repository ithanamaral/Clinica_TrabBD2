const Recepcionista = require('../../models/RecepcionistaModel');
const Endereco = require('../../models/EnderecoModel');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosRecep = Recepcionista.validarRecepcionista(dados);
            if (errosRecep.length > 0) erros.push(...errosRecep);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await RecepcionistaRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, turno } = dados;

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