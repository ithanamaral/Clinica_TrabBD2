const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

async function verificarMedico(req, res, next) {
    try {
        const { id_paci } = req.body;

        if (!id_paci) {
            return res.status(400).json({ erro: "ID do paciente é obrigatório." });
        }
        const db = getDb();
        const paciente = await db.collection('pacientes').findOne({ 
            _id: new ObjectId(id_paci) 
        });

        if (!paciente) {
            return res.status(403).json({ erro: "Paciente não encontrado." });
        }

        next();

    } catch (error) {
        return res.status(500).json({ erro: "Erro na validação de permissão: " + error.message });
    }
}

module.exports = verificarMedico;