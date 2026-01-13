const {getDb} = require('../../database');
const { ObjectId } = require('mongodb');

module.exports = {

    async select(req, res) {
        try {
            const { id_agen } = req.body;

            const db = getDb();
            const agendamento = await db.collection('agendamentos').findOne({ 
                _id: new ObjectId(id_agen) 
            });
            
            if (!id_agen) return res.status(400).json({erro: "ID não encontrado"});
            if (!agendamento) return res.status(404).json({erro: "Agendamento não encontrado"});
            if (!agendamento.status) return res.status(200).json({erro : ('Agendamento já atendido.')});

            res.status(200).json(agendamento);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async list(req, res) {
        try {
            const db = getDb();

            const agendamento = await db.collection('agendamentos').find({status : true}).toArray();

            if (agendamento.length === 0) {
                 return res.status(200).json({ mensagem: 'Sem agendamentos  para atende' });
            }
            
            res.status(200).json(agendamento);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { status, id_agend} = req.body;
            const db = getDb();
            const agendamento = await db.collection('agendamentos').findOne({ 
                _id: new ObjectId(id_agend) 
            });

            const erros = [];

            if (status !== undefined && typeof status !== 'boolean') erros.push("O campo 'status' deve ser boolean.")
            if (!id_agend) erros.push("O campo 'ID' do agendamento é obrigatório.");
            if (!agendamento) erros.push("Agendamento não encontrado");
            if (erros.length > 0) {
                return res.status(400).json({ erros});
            }

            await db.collection('agendamentos').updateOne(
                { _id: new ObjectId(id_agend) },
                {
                    $set: {
                        status,
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


}