const Medico = require('../../models/MedicoModel');
const { getDb } = require('../../database');
const { ObjectId } = require('mongodb');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, numero, uf, crm } = req.body;
            
            const erros = [];
            
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (numero && typeof numero !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (!uf) erros.push("O campo 'UF' é obrigatório.");
            if (crm && typeof crm !== 'number' && typeof crm !== 'string') {
                erros.push("CRM inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const medico = new Medico(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                numero,
                uf,
                crm
            );

            const db = getDb();
            const resultado = await db.collection('medicos').insertOne(medico);

            res.status(201).json({
                mensagem: "Medico cadastrado!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const db = getDb();
            
            const pacientes = await db.collection('medicos').find({}).toArray();
            res.json(pacientes);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const db = getDb();
            const paciente = await db.collection('medicos').findOne({ 
                _id: new ObjectId(id) 
            });

            if (!paciente) return res.status(404).json({erro: "Medico não encontrado"});

            res.status(200).json(paciente);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const db = getDb();
            const resultado = await db.collection('medicos').deleteOne({ 
                _id: new ObjectId(id) 
            });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Medico não encontrado para deletar." });
            }

            res.status(200).json({
                mensagem: "Medico deletado com sucesso!",
            });
            
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}