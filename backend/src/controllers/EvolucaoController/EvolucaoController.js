const Evolucao = require('../../models/EvolucaoModel');
const EvolucaoRepo = require('../../repositories/EvolucaoRepository');
const PacienteRepo = require('../../repositories/PacienteRepository');
const MedicoRepo = require('../../repositories/MedicoRepository');
const { ObjectId } = require('mongodb'); 

module.exports = {
    async create(req, res) {
        try {
            const { resumo, cid_prin, cid_secun, id_medic, id_paci } = req.body;
            const erros = [];

            if (!id_medic) return res.status(400).json({ erro: "ID do medico é obrigatório." });
            if (!id_paci) return res.status(400).json({ erro: "ID do paciente é obrigatório." });

            const medico = await MedicoRepo.findById(id_medic);
            const paciente = await PacienteRepo.findById(id_paci);

            if (!resumo) erros.push("O campo 'resumo' é obrigatório.");
            if (!cid_prin) erros.push("O campo 'cid_prin' é obrigatório.");
            if (!cid_secun) erros.push("O campo 'cid_secun' é obrigatório.");
            if (!paciente) erros.push("Paciente não encontrado");
            if (!medico) erros.push("Medico não encontrada");
            if (erros.length > 0) return res.status(400).json({ erros });

            const evolucao = new Evolucao (
                resumo,
                cid_prin,
                cid_secun,
                new ObjectId(id_medic),
                new ObjectId(id_paci)
            )
            
            const resultado = await EvolucaoRepo.create(evolucao);

            res.status(200).json({
                mensagem: "Evolução cadastrada!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro : error.message});
        }
    },

    async list(req, res) {
            try {
                const evolucao = await EvolucaoRepo.findAll();
                res.json(evolucao);
            } catch (error) {
                res.status(500).json({ erro: error.message});
            }
        },
    
    async select(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const evolucao = await EvolucaoRepo.findById(id);
                if (!evolucao) return res.status(404).json({erro: "Evolução não encontrado"});
    
                res.status(200).json(evolucao);
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
    },

    async update(req, res) {
        try {
            const { resumo, cid_prin, cid_secun, id_evolu } = req.body;
            const erros = [];
            
            if (!id_evolu) return res.status(400).json({ erro: "ID da evolucao é obrigatório." });
            
            const evolucao = await EvolucaoRepo.findById(id_evolu);

            if (!resumo) erros.push("O campo 'resumo' é obrigatório.");
            if (!cid_prin) erros.push("O campo 'cid_prin' é obrigatório.");
            if (!cid_secun) erros.push("O campo 'cid_secun' é obrigatório.");
            if (!evolucao) erros.push("Dados da evolução não encontrados");
            if (erros.length > 0) return res.status(400).json({ erros });

            const dadosAtualizados = {
                resumo,
                cid_prin,
                cid_secun,
            }

            await EvolucaoRepo.update(id_evolu, dadosAtualizados);

            res.status(200).json({
                mensagem: "Evolução atualizada!",
            });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async delete(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const resultado = await EvolucaoRepo.delete(id);
                
                if (!resultado || resultado.deletedCount === 0) {
                    return res.status(404).json({ erro: "Dados da evolução não encontrados para deletar." });
                }
    
                res.status(200).json({ mensagem: "Evolução do paciente deletada com sucesso!" });
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
        }
};