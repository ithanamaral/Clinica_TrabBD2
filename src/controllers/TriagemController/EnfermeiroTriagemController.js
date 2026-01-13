const Triagem  = require('../../models/TriagemModel');
const { getDb } = require('../../database');
const { ObjectId } = require('mongodb');


module.exports = {
    async create(req, res) {
        try {
            const { sinais_vitais, altura, peso, classificacao, 
                descricao, id_paci, id_enfer, id_agen } = req.body;

            const erros = [];

            const db =  getDb();

            if (!id_agen) return res.status(400).json({ erro: "ID do agendamento é obrigatório." });
            if (!id_paci) return res.status(400).json({ erro: "ID do paciente é obrigatório." });
            
            const paciente = await db.collection('pacientes').findOne({ _id: new ObjectId(id_paci) });
            const enfermeiro = await db.collection('enfermeiros').findOne({ _id: new ObjectId(id_enfer) });
            const agendamento = await db.collection('agendamentos').findOne({ _id: new ObjectId(id_agen) });


            if (!sinais_vitais) erros.push("O campo 'sinais vitais' é obrigatório");
            if (peso && typeof peso !== 'number' && typeof peso !== 'string') {
                erros.push("Peso inválido");
            }
            if (altura && typeof altura !== 'number' && typeof altura !== 'string') {
                erros.push("Altura inválida");
            }
            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!classificacao) erros.push("O campo 'classificacao' é obrigatório.");
            if (!paciente) erros.push("Paciente não encontrada");
            if (!enfermeiro) erros.push("Enferemeiro não encontrada");
            if (!agendamento) erros.push("Agendamento não encontrada");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const triagem = new Triagem (
                sinais_vitais, 
                altura, 
                peso, 
                classificacao, 
                descricao, 
                new ObjectId(id_paci), 
                new ObjectId(id_enfer), 
                new ObjectId(id_agen) 
            );

            const resultado = await db.collection('triagens').insertOne(triagem);

            res.status(201).json({
                mensagem: "Triagem realizada com sucesso!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async list(req, res) {
        try {
            const db = getDb();

            const triagem = await db.collection('triagens').find({}).toArray();
            res.json(triagem)

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const db = getDb();
            const triagem = await db.collection('triagens').findOne({ 
                _id: new ObjectId(id) 
            });

            if (!triagem) return res.status(404).json({erro: "Triagem não encontrada"});

            res.status(200).json(triagem);

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }, 

    async update(req, res) {
        try {
            const { sinais_vitais, altura, peso, classificacao, 
                descricao, id_enfer, id_triag } = req.body;

            const erros = [];

            if (!id_triag) return res.status(400).json({ erro: "ID da triagem é obrigatório." });

            const db = getDb();

            const triagem = await db.collection('triagens').findOne({ _id: new ObjectId(id_triag) });
            const enfermeiro = await db.collection('enfermeiros').findOne({ _id: new ObjectId(id_enfer) });


            if (!sinais_vitais) erros.push("O campo 'sinais vitais' é obrigatório");
            if (peso && typeof peso !== 'number' && typeof peso !== 'string') {
                erros.push("Peso inválido");
            }
            if (altura && typeof altura !== 'number' && typeof altura !== 'string') {
                erros.push("Altura inválida");
            }
            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!classificacao) erros.push("O campo 'classificacao' é obrigatório.");
            if (!triagem) erros.push("Triagem não encontrada");
            if (!enfermeiro) erros.push("Enferemeiro não encontrada");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            await db.collection('triagens').updateOne(
                { _id: new ObjectId(id_triag) },
                {
                    $set: {
                        sinais_vitais, 
                        altura, 
                        peso, 
                        classificacao, 
                        descricao,
                    }
                }
            );

            res.status(200).json({
                mensagem: "Triagem atualizada!",
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
            const resultado = await db.collection('triagens').deleteOne({ 
                _id: new ObjectId(id) 
            });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Triagem não encontrado para deletar." });
            }

            res.status(200).json({
                mensagem: "Triagem deletado com sucesso!",
            });


        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    }
}