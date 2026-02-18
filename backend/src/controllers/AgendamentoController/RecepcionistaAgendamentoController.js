const Agendamento = require('../../models/AgendamentoModel')
const AgendamentoRepo = require('../../repositories/AgendamentoRepository');
const MedicoRepo = require('../../repositories/MedicoRepository');
const PacienteRepo = require('../../repositories/PacienteRepository');
const { ObjectId } = require('mongodb'); 

module.exports = {

    async create(req, res) {
        try {
            const { data, descricao, status, horario, horarioFim, id_recep, id_medic, id_paci } = req.body;
            const erros = [];

            if (!id_paci) return res.status(400).json({ erro: "ID do paciente é obrigatório." });
            if (!id_medic) return res.status(400).json({ erro: "ID do medico é obrigatório." });

            const medico = await MedicoRepo.findById(id_medic);
            const paciente = await PacienteRepo.findById(id_paci);

            if (data && typeof data !== 'number' && typeof data !== 'string') {
                erros.push("Data inválida");
            }
            if (horario && typeof horario !== 'number' && typeof horario !== 'string') {
                erros.push("Horario inválido");
            }
            if (!horarioFim) erros.push("O horário de saída é obrigatório.");
            if (!descricao) erros.push("O campo 'descrição' é obrigatório.");
            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.");
            if (!paciente) erros.push("Paciente não encontrado");
            if (!medico) erros.push("Medico não encontrado");

            // --- NOVA TRAVA: VERIFICAÇÃO DE SOBREPOSIÇÃO DE HORÁRIOS ---
            if (id_medic && data && horario && horarioFim) {
                // Busca todos os agendamentos deste médico neste dia
                const agendamentosDoDia = await AgendamentoRepo.findByMedicoEData(id_medic, data);
                
                // Checa se algum agendamento existente atropela o novo
                const temConflito = agendamentosDoDia.some(apt => {
                    return (horario < apt.horarioFim) && (horarioFim > apt.horario);
                });

                if (temConflito) {
                    erros.push("O médico já possui um agendamento que conflita com este horário.");
                }
            }
            // -----------------------------------------------------------

            if (erros.length > 0) return res.status(400).json({ erros });

            const agendamento = new Agendamento(
                data,
                descricao,
                true,
                horario,
                horarioFim, // NOVO CAMPO AQUI
                new ObjectId(id_recep),
                new ObjectId(id_medic),
                new ObjectId(id_paci)
            );

            const resultado = await AgendamentoRepo.create(agendamento);

            res.status(201).json({
                mensagem: "Agendamento realizado!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },


    async list(req, res) {
        try {
            const agendamentos = await AgendamentoRepo.findAll();
            res.json(agendamentos);
        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async select(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const agendamento = await AgendamentoRepo.findById(id);
                if (!agendamento) return res.status(404).json({erro: "Agendamento não encontrado"});
    
                res.status(200).json(agendamento);
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
    },
        

    async update(req, res) {
        try {
            const { data, descricao, status, horario, horarioFim, id_agend, id_medic, id_paci } = req.body;
            const erros = [];
            
            if (!id_agend) return res.status(400).json({ erro: "ID do agendamento é obrigatório." });
            
            const agendamento = await AgendamentoRepo.findById(id_agend);

            if (data && typeof data !== 'number' && typeof data !== 'string') erros.push("Data inválida");
            if (horario && typeof horario !== 'number' && typeof horario !== 'string') erros.push("Horario inválido");
            if (!horarioFim) erros.push("O horário de saída é obrigatório.");
            if (!descricao) erros.push("O campo 'descrição' é obrigatório.");
            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.");
            if (!agendamento) erros.push("Agendamento não encontrado");

            // --- TRAVA: VERIFICA SOBREPOSIÇÃO NO UPDATE ---
            const medicoDoAgendamento = id_medic || agendamento.id_medic;
            if (medicoDoAgendamento && data && horario && horarioFim) {
                const agendamentosDoDia = await AgendamentoRepo.findByMedicoEData(medicoDoAgendamento, data);
                
                const temConflito = agendamentosDoDia.some(apt => {
                    if (apt._id.toString() === id_agend.toString()) return false;
                    return (horario < apt.horarioFim) && (horarioFim > apt.horario);
                });

                if (temConflito) {
                    erros.push("O médico já possui um agendamento que conflita com este novo horário.");
                }
            }

            if (erros.length > 0) return res.status(400).json({ erros });

            const dadosAtualizados = {
                data,
                horario,
                horarioFim,
                descricao,
                status
            };

            if (id_medic) dadosAtualizados.id_medic = new ObjectId(id_medic);
            if (id_paci) dadosAtualizados.id_paci = new ObjectId(id_paci);

            await AgendamentoRepo.update(id_agend, dadosAtualizados);

            res.status(200).json({ mensagem: "Agendamento atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
            try {
                const { id } = req.body;
                if (!id) return res.status(400).json({erro: "ID não encontrado"});
    
                const resultado = await AgendamentoRepo.delete(id);
                
                if (!resultado || resultado.deletedCount === 0) {
                    return res.status(404).json({ erro: "Agendamento não encontrado para deletar." });
                }
    
                res.status(200).json({ mensagem: "Agendamento deletado com sucesso!" });
            } catch (error) {
                res.status(500).json({erro : error.message});
            }
        }

}