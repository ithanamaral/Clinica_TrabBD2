const Enfermeiro = require('../../models/EnfermeiroModel');
const EnfermeiroRepo = require('../../repositories/EnfermeiroRepository');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, coren } = req.body;
            const erros = [];
            
            const usuarioExistente = await EnfermeiroRepo.findByCpfOrEmail(cpf, email);
            
            if (usuarioExistente) {
                if (usuarioExistente.cpf === cpf) erros.push("O CPF já existe no sistema.");
                if (usuarioExistente.email === email) erros.push("O e-mail já existe no sistema.");
            }
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (telefone && typeof telefone !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (!uf) erros.push("O campo 'UF' é obrigatório.");
            if (coren && typeof coren !== 'number') {
                erros.push("COREN inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const enfermeiro = new Enfermeiro(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                telefone,
                uf,
                coren
            );

            await enfermeiro.hashPassword();

            const resultado = await EnfermeiroRepo.create(enfermeiro);

            res.status(201).json({
                mensagem: "Enfermeiro cadastrado!",
                id_enfer: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const enfermeiros = await EnfermeiroRepo.findAll();
            res.json(enfermeiros);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const enfermeiro = await EnfermeiroRepo.findById(id);
            if (!enfermeiro) return res.status(404).json({erro: "Enfermeiro não encontrado"});

            res.status(200).json(enfermeiro);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, coren, id_recep, id_enfer } = req.body;
            const erros = [];

            if (!id_enfer) return res.status(400).json({erro: "ID enfermeiro obrigatório"});
            if (!id_recep) return res.status(400).json({erro: "ID recepcionista obrigatório"});

            const enfermeiro = await EnfermeiroRepo.findById(id_enfer);
            const recepcionista = await RecepcionistaRepo.findById(id_recep);

            if (!enfermeiro) erros.push("Enfermeiro não encontrado");
            if (!recepcionista) erros.push("Recepcionista não encontrado");
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (telefone && typeof telefone !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (!uf) erros.push("O campo 'UF' é obrigatório.");
            if (coren && typeof coren !== 'number') {
                erros.push("COREN inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dados = { 
                nome, 
                cpf, 
                email, 
                senha, 
                dataNasc, 
                endereco, 
                telefone, 
                uf, 
                coren };
            
            await EnfermeiroRepo.update(id_enfer, dados);

            res.status(200).json({ mensagem: "Enfermeiro atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await EnfermeiroRepo.delete(id);

            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Enfermeiro não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Enfermeiro deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}