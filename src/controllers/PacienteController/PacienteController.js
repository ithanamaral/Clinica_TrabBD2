const Paciente = require('../../models/PacienteModel');
const { getDb } = require('../../database');
const { ObjectId } = require('mongodb');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, numero, tipoSang } = req.body;

            const erros = [];
            
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!tipoSang) erros.push("O campo 'tipoSang' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (numero && typeof numero !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const paciente = new Paciente(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                numero,
                tipoSang
            );

            const db = getDb();
            const resultado = await db.collection('pacientes').insertOne(paciente);

            res.status(201).json({
                mensagem: "Paciente cadastrado!",
                id_paci: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const db = getDb();
            
            const pacientes = await db.collection('pacientes').find({}).toArray();
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
            const paciente = await db.collection('pacientes').findOne({ 
                _id: new ObjectId(id) 
            });

            if (!paciente) return res.status(404).json({erro: "Paciente não encontrado"});

            res.status(200).json(paciente);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, numero, tipoSang, id_recep, id_paci } = req.body;
            const db = getDb();
            const paciente = await db.collection('pacientes').findOne({ 
                _id: new ObjectId(id_paci) 
            });
            const recepcionista = await db.collection('recepcionistas').findOne({ 
                _id: new ObjectId(id_recep) 
            });
            const erros = [];

            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!tipoSang) erros.push("O campo 'tipoSang' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (!endereco) erros.push("O campo 'endereço' é obrigatório.");
            if (numero && typeof numero !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (!paciente) erros.push("Paciente não encontrado");
            if (!recepcionista) erros.push("Recepcionista não encontrado");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            await db.collection('pacientes').updateOne(
                { _id: new ObjectId(id_paci) },
                {
                    $set: {
                        nome,
                        cpf,
                        email,
                        senha,
                        dataNasc,
                        endereco,
                        numero,
                        tipoSang
                    }
                }
            );

            res.status(200).json({
                mensagem: "Paciente atualizado!",
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
            const resultado = await db.collection('pacientes').deleteOne({ 
                _id: new ObjectId(id) 
            });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Paciente não encontrado para deletar." });
            }

            res.status(200).json({
                mensagem: "Paciente deletado com sucesso!",
            });
            
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}