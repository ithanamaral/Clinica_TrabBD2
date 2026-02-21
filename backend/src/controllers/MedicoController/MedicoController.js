const Medico = require('../../models/MedicoModel');
const Endereco = require('../../models/EnderecoModel');
const MedicoRepo = require('../../repositories/MedicoRepository');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosMedi = Medico.validarMedico(dados);
            if (errosMedi.length > 0) erros.push(...errosMedi);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await MedicoRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, uf, crm, especialidade, descricao } = dados;

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

            if (!medico) erros.push("Médico não encontrado.");
            if (!recepcionista) erros.push("Recepcionista não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            const dados = { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, crm, especialidade, descricao };

            const errosValidacao = Medico.validarMedico(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await MedicoRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_medic)) {
                        if (usuarioExistente.cpf === cpf) erros.push("Este CPF já está sendo usado por outro usuário.");
                        if (usuarioExistente.email === email) erros.push("Este E-mail já está sendo usado por outro usuário.");
                    }
                }
            }

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