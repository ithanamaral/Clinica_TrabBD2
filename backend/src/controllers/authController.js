const MedicoRepo = require('../repositories/MedicoRepository');
const PacienteRepo = require('../repositories/PacienteRepository');
const EnfermeiroRepo = require('../repositories/EnfermeiroRepository');
const RecepRepo = require('../repositories/RecepcionistaRepository');
const AdminRepo = require('../repositories/AdminRepository');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

module.exports = {
    async login(req, res) {
        try {
            const { email, senha, tipo } = req.body;
            let usuario = null;

            switch(tipo.toLowerCase()) {
                case 'medico': 
                    usuario = await MedicoRepo.findByEmail(email);
                    break;
                case 'paciente': 
                    usuario = await PacienteRepo.findByEmail(email);
                    break;
                case 'recepcionista': 
                    usuario = await RecepRepo.findByEmail(email);
                    break;
                case 'enfermeiro': 
                    usuario = await EnfermeiroRepo.findByEmail(email);
                    break;
                case 'admin':
                    usuario = await AdminRepo.findByEmail(email);
                    break;
                default: 
                    return res.status(400).json({ erro: "Tipo de usuário inválido" });
            }

            if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado" });
            
            const senhaValida = await bcryptjs.compare(senha, usuario.senha);
            if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

            const token = jwt.sign({ 
                id: usuario._id, 
                tipo: tipo.toLowerCase() 
            }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });

            res.status(200).json({
                mensagem: "Login realizado!",
                token: token,
                usuario: { 
                    nome: usuario.nome,
                    tipo: tipo.toLowerCase(),
                    id: usuario._id
                }
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};