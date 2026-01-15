const TriagemRepo = require('../../repositories/TriagemRepository');
const MedicoRepo = require('../../repositories/MedicoRepository');

module.exports = {
    async list(req, res) {
        try {
            const triagens = await TriagemRepo.findAll();
            res.json(triagens);
        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const triagem = await TriagemRepo.findById(id);
            if (!triagem) return res.status(404).json({erro: "Triagem não encontrada"});

            res.status(200).json(triagem);
        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async update(req, res) {
        try {
            const { sinais_vitais, altura, peso, classificacao, 
                descricao, id_medic , id_triag } = req.body;
                
            const erros = [];
            if (!id_triag) return res.status(400).json({ erro: "ID da triagem é obrigatório." });

            const triagem = await TriagemRepo.findById(id_triag);
            const medico = await MedicoRepo.findById(id_medic);

            if (!triagem) erros.push("Triagem não encontrada");
            if (!medico) erros.push("Médico não encontrado");
            if (!sinais_vitais) erros.push("O campo 'sinais vitais' é obrigatório");
            if (peso && typeof peso !== 'number' && typeof peso !== 'string') {
                erros.push("Peso inválido");
            }
            if (altura && typeof altura !== 'number' && typeof altura !== 'string') {
                erros.push("Altura inválida");
            }
            if (!descricao) erros.push("O campo 'descricao' é obrigatório.");
            if (!classificacao) erros.push("O campo 'classificacao' é obrigatório.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dados = { 
                sinais_vitais,
                altura, 
                peso, 
                classificacao, 
                descricao 
            };

            await TriagemRepo.update(id_triag, dados);

            res.status(200).json({ mensagem: "Triagem atualizada!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },
}