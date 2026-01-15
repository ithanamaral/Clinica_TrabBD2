const Medico = require('../../models/MedicoModel');
const MedicoRepo = require('../../repositories/MedicoRepository');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, crm, especialidade, descricao } = req.body;
            
            const erros = [];

            const usuarioExistente = await MedicoRepo.findByCpfOrEmail(cpf, email);
            
            if (usuarioExistente) {
                if (usuarioExistente.cpf === cpf) erros.push("O CPF já existe no sistema.");
                if (usuarioExistente.email === email) erros.push("O e-mail já existe no sistema.");
            }
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!especialidade) erros.push("O campo 'especialidade' é obrigatório.");
            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (telefone && typeof telefone !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (!uf) erros.push("O campo 'UF' é obrigatório.");
            if (crm && typeof crm !== 'number' && typeof crm !== 'string') {
                erros.push("CRM inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const medico = new Medico(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                telefone,
                uf,
                crm, 
                especialidade, 
                descricao
            );  

            await medico.hashPassword();

            const resultado = await MedicoRepo.create(medico);

            res.status(201).json({
                mensagem: "Medico cadastrado!",
                id_medic: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const medicos = await MedicoRepo.findAll();
            res.json(medicos);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const medico = await MedicoRepo.findById(id);
            if (!medico) return res.status(404).json({erro: "Medico não encontrado"});

            res.status(200).json(medico);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, crm, especialidade, descricao, id_recep, id_medic } = req.body;
            const erros = [];

            if (!id_medic) return res.status(400).json({erro: "ID do médico obrigatório"});
            if (!id_recep) return res.status(400).json({erro: "ID do recepcionista obrigatório"});

            const medico = await MedicoRepo.findById(id_medic);
            const recepcionista = await RecepcionistaRepo.findById(id_recep);

            if (!medico) erros.push("Medico não encontrado");
            if (!recepcionista) erros.push("Recepcionista não encontrado");
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!especialidade) erros.push("O campo 'especialidade' é obrigatório.");
            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (telefone && typeof telefone !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (!uf) erros.push("O campo 'UF' é obrigatório.");
            if (crm && typeof crm !== 'number' && typeof crm !== 'string') {
                erros.push("CRM inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dadosAtualizados = {
                nome, 
                cpf, 
                email, 
                senha, 
                dataNasc, 
                endereco, 
                telefone, 
                uf, 
                crm, 
                especialidade, 
                descricao
            };

            await MedicoRepo.update(id_medic, dadosAtualizados);

            res.status(200).json({ mensagem: "Medico atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await MedicoRepo.delete(id);

            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Medico não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Medico deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}