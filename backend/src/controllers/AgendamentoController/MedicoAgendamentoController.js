const AgendamentoRepo = require('../../repositories/AgendamentoRepository');

module.exports = {

    async select(req, res) {
        try {
            const { id_agen } = req.body;
            if (!id_agen) return res.status(400).json({erro: "ID não encontrado"});

            const agendamento = await AgendamentoRepo.findById(id_agen);
            
            if (!agendamento) return res.status(404).json({erro: "Agendamento não encontrado"});
            if (!agendamento.status) return res.status(200).json({erro : ('Agendamento já atendido.')});

            res.status(200).json(agendamento);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async list(req, res) {
        try {
            const agendamentos = await AgendamentoRepo.findPendentes();

            if (agendamentos.length === 0) {
                 return res.status(200).json({ mensagem: 'Sem agendamentos para atender' });
            }
            
            res.status(200).json(agendamentos);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { status, id_agend} = req.body;
            const erros = [];
            
            if (!id_agend) return res.status(400).json({ erro: "ID do agendamento é obrigatório." });

            const agendamento = await AgendamentoRepo.findById(id_agend);

            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.")
            if (!agendamento) erros.push("Agendamento não encontrado");
            
            if (erros.length > 0) return res.status(400).json({ erros});

            await AgendamentoRepo.update(id_agend, { status });

            res.status(200).json({ mensagem: "Agendamento atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 
}