const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

async function verificarMedico(req, res, next) {
    try {
        const { id_medic } = req.body;

        if (!id_medic) {
            return res.status(400).json({ erro: "ID da medico é obrigatório." });
        }
        const db = getDb();
        const medico = await db.collection('medicos').findOne({ 
            _id: new ObjectId(id_medic) 
        });

        if (!medico) {
            return res.status(403).json({ erro: "Médico não encontrado." });
        }

        next();

    } catch (error) {
        return res.status(500).json({ erro: "Erro na validação de permissão: " + error.message });
    }
}

module.exports = verificarMedico;