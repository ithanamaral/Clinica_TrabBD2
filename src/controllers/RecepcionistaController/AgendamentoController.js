const Enfermeiro = require('../../models/EnfermeiroModel');
const Agendamento = require('../../models/AgendamentoModel')
const {getDb} = require('../../database')
const { ObjectId } = require('mongodb');

module.exports = {

    async create(req, res) {
        try {
            const { data, descricao, status, id_recep, id_medic, id_paci } = req.body;
            const erros = [];

            if (data && typeof data !== 'number' && typeof data !== 'string') {
                erros.push("Data inválida")
            }
            if (!descricao) erros.push("O campo 'descrição' é obrigatório.")
            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.")
            if (!id_medic) erros.push("ID do Médico é obrigatório");
            if (!id_paci) erros.push("ID do Paciente é obrigatório");
            if (!descricao) erros.push("Descrição é obrigatória");

            if (erros.length > 0) return res.status(400).json({ erros });

            const db = getDb();

            const medico = await db.collection('medicos').findOne({ _id: new ObjectId(id_medic) });
            const paciente = await db.collection('pacientes').findOne({ _id: new ObjectId(id_paci) });

            if (!medico || !paciente) {
                return res.status(404).json({ erro: "Médico ou Paciente não encontrados" });
            }

            const novoAgendamento = {
                data,
                descricao,
                status: status || true, 
                responsavel_agendamento: new ObjectId(id_recep), 
                medic_id: new ObjectId(id_medic),             
                paci_id: new ObjectId(id_paci),         
                data_criacao: new Date()
            };

            const resultado = await db.collection('agendamentos').insertOne(novoAgendamento);

            res.status(201).json({
                mensagem: "Agendamento realizado com sucesso!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },


    async list(req, res) {
        try {
            const db = getDb();

            const agendamento = await db.collection('agendamentos').find({}).toArray();
            res.json(agendamento)

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const db = getDb();
            const agendamento = await db.collection('agendamentos').findOne({ 
                _id: new ObjectId(id) 
            });

            if (!agendamento) return res.status(404).json({erro: "Agendamento não encontrado"});

            res.status(200).json(agendamento);

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async update(req, res) {
        try {
            const { data, descricao, status, id_recep, id_agend } = req.body;
            const db = getDb();
            const agendamento = await db.collection('agendamentos').findOne({ 
                _id: new ObjectId(id_agend) 
            });
            const recepcionista = await db.collection('recepcionistas').findOne({ 
                _id: new ObjectId(id_recep) 
            });
            const erros = [];

            if (data && typeof data !== 'number' && typeof data !== 'string') {
                erros.push("Data inválida")
            }
            if (!descricao) erros.push("O campo 'descrição' é obrigatório.")
            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.")
            if (!id_recep) erros.push("O campo 'ID' do recepcionita é obrigatório.");
            if (!id_agend) erros.push("O campo 'ID' do agendamento é obrigatório.");
            if (!agendamento) erros.push("Agendamento não encontrado");
            if (!recepcionista) erros.push("Recepcionista não encontrado");
            if (erros.length > 0) {
                return res.status(400).json({ erros});
            }

            await db.collection('agendamentos').updateOne(
                { _id: new ObjectId(id_agend) },
                {
                    $set: {
                        data,
                        descricao,
                        status,
                        id_recep
                    }
                }
            );

            res.status(200).json({
                mensagem: "Agendamento atualizado!",
            });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async delete(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const db = getDb();
            const resultado = await db.collection('agendamentos').deleteOne({ 
                _id: new ObjectId(id) 
            });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Agendamento não encontrado para deletar." });
            }

            res.status(200).json({
                mensagem: "Agendamento deletado com sucesso!",
            });


        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }

}