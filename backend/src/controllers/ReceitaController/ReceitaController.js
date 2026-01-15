const Receita = require('../../models/ReceitaModel');
const EvolucaoRepo  = require('../../repositories/EvolucaoRepository');
const MedicoRepo = require('../../repositories/MedicoRepository');
const PacienteRepo = require('../../repositories/PacienteRepository');
const ReceitaRepo = require('../../repositories/ReceitaRepository');
const { ObjectId } = require('mongodb'); 


module.exports = {
    async create(req, res) {
        try {
            const { descricao, validade, emissao, id_medic, id_evolu, id_paci } = req.body;
            const erros = [];

            if (!id_medic) return res.status(400).json({ erro: "ID do medico é obrigatório." });
            if (!id_paci) return res.status(400).json({ erro: "ID do paciente é obrigatório." });
            if (!id_evolu) return res.status(400).json({ erro: "ID da evolucao é obrigatório." });

            const medico = await MedicoRepo.findById(id_medic);
            const paciente = await PacienteRepo.findById(id_paci);
            const evolucao = await EvolucaoRepo.findById(id_evolu);

            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!emissao) erros.push("O campo 'emissao' é obrigatório.");
            if (validade && typeof validade !== 'number' && typeof validade !== 'string') {
                erros.push("Validade inválida.");
            }if (!paciente) erros.push("Paciente não encontrado");
            if (!medico) erros.push("Medico não encontrada");
            if (!evolucao) erros.push("Dados da evolução não encontrado");
            if (erros.length > 0) return res.status(400).json({ erros });

            const receita = new Receita (
                descricao,
                validade,
                emissao,
                new ObjectId(id_medic),
                new ObjectId(id_evolu),
                new ObjectId(id_paci)
            )
            
            const resultado = await ReceitaRepo.create(receita);

            res.status(200).json({
                mensagem: "Prescrição para receita cadastrado!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro : error.message});
        }
    },

    async list(req, res) {
            try {
                const receita = await ReceitaRepo.findAll();
                res.json(receita);
            } catch (error) {
                res.status(500).json({ erro: error.message});
            }
        },
    
    async select(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const receita = await ReceitaRepo.findById(id);
                if (!receita) return res.status(404).json({erro: "Prescrição para receita não encontrado"});
    
                res.status(200).json(receita);
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
    },

    async update(req, res) {
        try {
            const { descricao, validade, emissao, id_rece } = req.body;
            const erros = [];
            
            if (!id_rece) return res.status(400).json({ erro: "ID da receita é obrigatório." });
            
            const receita = await ReceitaRepo.findById(id_rece);

            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!emissao) erros.push("O campo 'emissao' é obrigatório.");
            if (validade && typeof validade !== 'number' && typeof validade !== 'string') {
                erros.push("Validade inválida.");
            }
            if (erros.length > 0) return res.status(400).json({ erros });

            const dadosAtualizados = {
                descricao,
                validade,
                emissao
            }

            await ReceitaRepo.update(id_rece, dadosAtualizados);

            res.status(200).json({
                mensagem: "Prescrição para receita atualizado!",
            });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async delete(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const resultado = await ReceitaRepo.delete(id);
                
                if (!resultado || resultado.deletedCount === 0) {
                    return res.status(404).json({ erro: "Dados da receita não encontrado para deletar." });
                }
    
                res.status(200).json({ mensagem: "Pedido da receita do paciente deletado com sucesso!" });
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
        }
};