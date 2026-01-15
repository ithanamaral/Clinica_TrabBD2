const ExamePedido = require('../../models/ExamePedidoModel');
const MedicoRepo = require('../../repositories/MedicoRepository');
const PacienteRepo = require('../../repositories/PacienteRepository');
const EvolucaoRepo = require('../../repositories/EvolucaoRepository');
const ExamePedidoRepo = require('../../repositories/ExamePedidoRepository');
const { ObjectId } = require('mongodb'); 


module.exports = {
    async create(req, res) {
        try {
            const { status, arq_resultado, tipo_exame, id_medic, id_evolu, id_paci } = req.body;
            const erros = [];

            if (!id_medic) return res.status(400).json({ erro: "ID do medico é obrigatório." });
            if (!id_paci) return res.status(400).json({ erro: "ID do paciente é obrigatório." });
            if (!id_evolu) return res.status(400).json({ erro: "ID da evolucao é obrigatório." });

            const medico = await MedicoRepo.findById(id_medic);
            const paciente = await PacienteRepo.findById(id_paci);
            const evolucao = await EvolucaoRepo.findById(id_evolu);

            if (!arq_resultado) erros.push("O campo 'arq_resultado' é obrigatório.");
            if (!tipo_exame) erros.push("O campo 'tipo_exame' é obrigatório.");
            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.")
            if (!paciente) erros.push("Paciente não encontrado");
            if (!medico) erros.push("Medico não encontrada");
            if (!evolucao) erros.push("Dados da evolução não encontrado");
            if (erros.length > 0) return res.status(400).json({ erros });

            const exame = new ExamePedido (
                true,
                arq_resultado,
                tipo_exame,
                new ObjectId(id_medic),
                new ObjectId(id_evolu),
                new ObjectId(id_paci)
            )
            
            const resultado = await ExamePedidoRepo.create(exame);

            res.status(200).json({
                mensagem: "Pedido para exame cadastrado!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro : error.message});
        }
    },

    async list(req, res) {
            try {
                const exame = await ExamePedidoRepo.findAll();
                res.json(exame);
            } catch (error) {
                res.status(500).json({ erro: error.message});
            }
        },
    
    async select(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const exame = await ExamePedidoRepo.findById(id);
                if (!exame) return res.status(404).json({erro: "Pedido de exame não encontrado"});
    
                res.status(200).json(exame);
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
    },

    async update(req, res) {
        try {
            const { status, arq_resultado, tipo_exame, id_exame } = req.body;
            const erros = [];
            
            if (!id_exame) return res.status(400).json({ erro: "ID do pedido de exame é obrigatório." });
            
            const exame = await ExamePedidoRepo.findById(id_exame);

            if (!arq_resultado) erros.push("O campo 'arq_resultado' é obrigatório.");
            if (!tipo_exame) erros.push("O campo 'tipo_exame' é obrigatório.");
            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.")
            if (!exame) erros.push("Dados do pedido do exame não encontrado");
            if (erros.length > 0) return res.status(400).json({ erros });

            const dadosAtualizados = {
                status,
                arq_resultado,
                tipo_exame
            }

            await ExamePedidoRepo.update(id_exame, dadosAtualizados);

            res.status(200).json({
                mensagem: "Dados do pedido atualizado!",
            });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async delete(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const resultado = await ExamePedidoRepo.delete(id);
                
                if (!resultado || resultado.deletedCount === 0) {
                    return res.status(404).json({ erro: "Dados do pedido do exame não encontrado para deletar." });
                }
    
                res.status(200).json({ mensagem: "Pedido de exame do paciente deletado com sucesso!" });
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
        }
};