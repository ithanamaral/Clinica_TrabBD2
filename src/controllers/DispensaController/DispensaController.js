const DispensaRepo = require('../../repositories/DispensaRepository');

module.exports = {

    async list(req, res) {
        try {
            const dispensas = await DispensaRepo.findAll();
            res.json(dispensas);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const dispensa = await DispensaRepo.findById(id);
            if (!dispensa) return res.status(404).json({erro: "Comprovante de dispensa não encontrado"});

            res.status(200).json(dispensa);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};