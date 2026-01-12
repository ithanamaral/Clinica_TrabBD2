const Enfermeiro = require('../../models/EnfermeiroModel');
const { getDb } = require('../../database');
const { ObjectId } = require('mongodb');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, numero, uf, coren } = req.body;
            
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
            if (coren && typeof coren !== 'number') {
                erros.push("COREN inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const enfermeiro = new Enfermeiro(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                numero,
                uf,
                coren
            );

            const db = getDb();
            const resultado = await db.collection('enfermeiros').insertOne(enfermeiro);

            res.status(201).json({
                mensagem: "Enfermeiro cadastrado!",
                id_enfer: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const db = getDb();
            
            const enfermeiros = await db.collection('enfermeiros').find({}).toArray();
            res.json(enfermeiros);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const db = getDb();
            const enfermeiro = await db.collection('enfermeiros').findOne({ 
                _id: new ObjectId(id) 
            });

            if (!enfermeiro) return res.status(404).json({erro: "Enfermeiro não encontrado"});

            res.status(200).json(enfermeiro);

        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, numero, uf, coren, id_recep, id_enfer } = req.body;
            const db = getDb();
            const enfermeiro = await db.collection('enfermeiros').findOne({ 
                _id: new ObjectId(id_enfer) 
            });
            const recepcionista = await db.collection('recepcionistas').findOne({ 
                _id: new ObjectId(id_recep) 
            });
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
            if (coren && typeof coren !== 'number') {
                erros.push("COREN inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (!enfermeiro) erros.push("Enfermeiro não encontrado");
            if (!recepcionista) erros.push("Recepcionista não encontrado");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            await db.collection('enfermeiros').updateOne(
                { _id: new ObjectId(id_enfer) },
                {
                    $set: {
                        nome,
                        cpf,
                        email,
                        senha,
                        dataNasc,
                        endereco,
                        numero,
                        uf,
                        coren
                    }
                }
            );

            res.status(200).json({
                mensagem: "Enfermeiro atualizado!",
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
            const resultado = await db.collection('enfermeiros').deleteOne({ 
                _id: new ObjectId(id) 
            });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Enfermeiro não encontrado para deletar." });
            }

            res.status(200).json({
                mensagem: "Enfermeiro deletado com sucesso!",
            });
            
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}