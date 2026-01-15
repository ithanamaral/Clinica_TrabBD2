const Medicamento = require('../../models/MedicamentoModel');
const Dispensa = require('../../models/DispensaModel'); 
const MedicamentoRepo = require('../../repositories/MedicamentoRepository');
const PacienteRepo = require('../../repositories/PacienteRepository');
const EnfermeiroRepo = require('../../repositories/EnfermeiroRepository');
const DispensaRepo = require('../../repositories/DispensaRepository'); 
const { ObjectId } = require('mongodb'); 

module.exports = {
    async create(req, res) {
        try {
            const { nome, principio, qnt_disp, id_enfer } = req.body;
            const erros = [];

            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!principio) erros.push("O campo 'principio' é obrigatório.");
            if (!id_enfer) erros.push("O campo 'id_enfer' é obrigatório (Quem está cadastrando?).");
            if (qnt_disp && typeof qnt_disp !== 'number') erros.push("Quantidade inválida.");
            const enfermeiro = await EnfermeiroRepo.findById(id_enfer);
            if (!enfermeiro) erros.push("Enfermeiro não encontrado.");

            if (erros.length > 0) return res.status(400).json({ erros });

            const medicamento = new Medicamento (
                nome,
                principio,
                qnt_disp,
                new ObjectId(id_enfer)
            );
            
            const resultado = await MedicamentoRepo.create(medicamento);

            res.status(201).json({
                mensagem: "Medicamento cadastrado!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro : error.message});
        }
    },

    async list(req, res) {
        try {
            const medicamento = await MedicamentoRepo.findAll();
            res.json(medicamento);
        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },
    
    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const medicamento = await MedicamentoRepo.findById(id);
            if (!medicamento) return res.status(404).json({erro: "Medicamento não encontrado"});

            res.status(200).json(medicamento);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, principio, qnt_disp, id_medicam } = req.body;
            const erros = [];
            
            if (!id_medicam) return res.status(400).json({ erro: "ID da medicamento é obrigatório." });
            
            const medicamento = await MedicamentoRepo.findById(id_medicam);

            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!principio) erros.push("O campo 'principio' é obrigatório.");
            if (qnt_disp && typeof qnt_disp !== 'number') erros.push("Quantidade inválida.");
            if (!medicamento) erros.push("Medicamento não encontrado.");
            if (erros.length > 0) return res.status(400).json({ erros });

            const dadosAtualizados = {
                nome,
                principio,
                qnt_disp,
            }

            await MedicamentoRepo.update(id_medicam, dadosAtualizados);

            res.status(200).json({
                mensagem: "Medicamento atualizado!",
            });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await MedicamentoRepo.delete(id);
            
            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Dados do medicamento não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Medicamento deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async dispensar(req, res) {
        try {
            const { id_medicam, quantidade, id_paci, id_enfer } = req.body;
            const erros = [];

            if (!id_medicam) erros.push("ID do medicamento é obrigatório.");
            if (!quantidade) erros.push("Quantidade é obrigatória.");
            if (!id_paci) erros.push("ID do paciente é obrigatório.");
            if (!id_enfer) erros.push("ID do enfermeiro é obrigatório.");
            if (erros.length > 0) return res.status(400).json({ erros });

            const medicamento = await MedicamentoRepo.findById(id_medicam);
            const paciente = await PacienteRepo.findById(id_paci);
            const enfermeiro = await EnfermeiroRepo.findById(id_enfer);

            if (!medicamento) return res.status(404).json({ erro: "Medicamento não encontrado" });
            if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado" });
            if (!enfermeiro) return res.status(404).json({ erro: "Enfermeiro não encontrado" });
            
            if (medicamento.qnt_disp < quantidade) {
                return res.status(400).json({ erro: `Estoque insuficiente. Disponível: ${medicamento.qnt_disp}` });
            }

            await MedicamentoRepo.diminuirEstoque(id_medicam, quantidade);

            const registroDispensa = new Dispensa(
                new ObjectId(id_medicam),
                new ObjectId(id_paci),
                new ObjectId(id_enfer),
                quantidade
            );
            
            await DispensaRepo.create(registroDispensa);

            res.status(200).json({ 
                mensagem: "Medicamento dispensado e registrado com sucesso!",
                estoque_restante: medicamento.qnt_disp - quantidade,
                comprovante: registroDispensa
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};