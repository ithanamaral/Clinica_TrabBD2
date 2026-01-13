const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

async function verificarMedico(req, res, next) {
    try {
        const { id_enfer } = req.body;

        if (!id_enfer) {
            return res.status(400).json({ erro: "ID do enfermeiro é obrigatório." });
        }
        const db = getDb();
        const enfermeiro = await db.collection('enfermeiros').findOne({ 
            _id: new ObjectId(id_enfer) 
        });

        if (!enfermeiro) {
            return res.status(403).json({ erro: "Enfermeiro não encontrado." });
        }

        next();

    } catch (error) {
        return res.status(500).json({ erro: "Erro na validação de permissão: " + error.message });
    }
}

module.exports = verificarMedico;