const { getDb } = require('../database');

module.exports = {
    async login(req, res) {
        try {
            const { email, senha, tipo } = req.body;

            if (!email || !senha || !tipo) {
                return res.status(400).json({ erro: "Email, senha e tipo são obrigatórios" });
            }

            const db = getDb();
            let collectionName = '';

            switch(tipo.toLowerCase()) {
                case 'medico': 
                    collectionName = 'medicos'; 
                    break;
                case 'paciente': 
                    collectionName = 'pacientes'; 
                    break;
                case 'recepcionista': 
                    collectionName = 'recepcionistas'; 
                    break;
                case 'enfermeiro': 
                    collectionName = 'enfermeiros'; 
                    break;
                default: 
                    return res.status(400).json({ erro: "Tipo de usuário inválido" });
            }

            const usuario = await db.collection(collectionName).findOne({ email });

            if (!usuario) {
                return res.status(401).json({ erro: "Usuário ou senha inválidos" });
            }

            if (usuario.senha !== senha) {
                return res.status(401).json({ erro: "Usuário ou senha inválidos" });
            }

            const { senha: _, ...dadosUsuario } = usuario;
            
            res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                usuario: dadosUsuario,
                tipo: tipo
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};