const Dispensa = require('../../models/DispensaModel');
const DispensaRepo = require('../../repositories/DispensaRepository');
const MedicamentoRepo = require('../../repositories/MedicamentoRepository');
const PacienteRepo = require('../../repositories/PacienteRepository');
const EnfermeiroRepo = require('../../repositories/EnfermeiroRepository');
const { ObjectId } = require('mongodb');

module.exports = {

    async create(req, res) {
        try {
            const { id_medicam, id_paci, id_enfer, quantidade } = req.body;
            const erros = [];

            if (!id_medicam) erros.push("ID do medicamento é obrigatório.");
            if (!id_paci) erros.push("ID do paciente é obrigatório.");
            if (!id_enfer) erros.push("ID do enfermeiro é obrigatório.");
            if (!quantidade || quantidade <= 0) erros.push("Quantidade inválida.");

            if (erros.length > 0) return res.status(400).json({ erros });

            // Verificar existências
            const medicamento = await MedicamentoRepo.findById(id_medicam);
            const paciente = await PacienteRepo.findById(id_paci);
            const enfermeiro = await EnfermeiroRepo.findById(id_enfer);

            if (!medicamento) return res.status(404).json({ erro: "Medicamento não encontrado." });
            if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado." });
            if (!enfermeiro) return res.status(404).json({ erro: "Enfermeiro não encontrado." });

            // Verificar Estoque
            const estoqueAtual = medicamento.qnt_disp || medicamento.quantidade || 0;
            if (estoqueAtual < quantidade) {
                return res.status(400).json({ erro: `Estoque insuficiente. Disponível: ${estoqueAtual}` });
            }

            // 1. Criar registro de Dispensa
            const dispensa = new Dispensa(
                new ObjectId(id_medicam),
                new ObjectId(id_paci),
                new ObjectId(id_enfer),
                Number(quantidade)
            );
            await DispensaRepo.create(dispensa);

            // 2. Atualizar Estoque do Medicamento
            const novaQuantidade = estoqueAtual - Number(quantidade);
            await MedicamentoRepo.update(id_medicam, { 
                qnt_disp: novaQuantidade
            });

            res.status(201).json({ 
                mensagem: "Medicamento dispensado com sucesso!",
                novo_estoque: novaQuantidade
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const dispensas = await DispensaRepo.findAll();
            res.json(dispensas);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const dispensa = await DispensaRepo.findById(id);
            if (!dispensa) return res.status(404).json({erro: "Comprovante de dispensa não encontrado"});

            res.status(200).json(dispensa);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};