const Paciente = require('../../models/PacienteModel');
const PacienteRepo = require('../../repositories/PacienteRepository');
const Endereco = require('../../models/EnderecoModel');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');

module.exports = {

    async create(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, tipoSang } = req.body;
            
            const erros = [];

            const usuarioExistente = await PacienteRepo.findByCpfOrEmail(cpf, email);
            
            if (usuarioExistente) {
                if (usuarioExistente.cpf === cpf) erros.push("O CPF já existe no sistema.");
                if (usuarioExistente.email === email) erros.push("O e-mail já existe no sistema.");
            }
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!tipoSang) erros.push("O campo 'tipoSang' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (endereco) {
                const errosEndereco = Endereco.validarEndereco(endereco);
                if (errosEndereco.length > 0) erros.push(...errosEndereco);
            }
            if (telefone && typeof telefone !== 'number') {
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
                telefone, 
                tipoSang
            );

            await paciente.hashPassword();

            const resultado = await PacienteRepo.create(paciente);

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
            const pacientes = await PacienteRepo.findAll();
            res.json(pacientes);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const paciente = await PacienteRepo.findById(id);
            if (!paciente) return res.status(404).json({erro: "Paciente não encontrado"});

            res.status(200).json(paciente);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, tipoSang, id_recep, id_paci } = req.body;
            const erros = [];

            if (!id_paci) return res.status(400).json({ erro: "ID do paciente obrigatório" });
            if (!id_recep) return res.status(400).json({ erro: "ID do recepcionista obrigatório" });

            const paciente = await PacienteRepo.findById(id_paci);
            const recepcionista = await RecepcionistaRepo.findById(id_recep);

            if (!paciente) erros.push("Paciente não encontrado");
            if (!recepcionista) erros.push("Recepcionista não encontrada");
            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!tipoSang) erros.push("O campo 'tipoSang' é obrigatório.");
            if (!cpf) erros.push("O campo 'cpf' é obrigatório.");
            if (!senha) erros.push("O campo 'senha' é obrigatório.");
            if (endereco) {
                const errosEndereco = Endereco.validarEndereco(endereco);
                if (errosEndereco.length > 0) erros.push(...errosEndereco);
            }
            if (telefone && typeof telefone !== 'number') {
                erros.push("Número inválido.");
            }
            if (dataNasc && typeof dataNasc !== 'number' && typeof dataNasc !== 'string') {
                erros.push("Data de nascimento inválida.");
            }
            if (email && !email.includes('@')) erros.push("E-mail inválido.");
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dadosAtualizados = { 
                nome, 
                cpf, 
                email, 
                senha, 
                dataNasc, 
                endereco, 
                telefone, 
                tipoSang 
            };

            await PacienteRepo.update(id_paci, dadosAtualizados);

            res.status(200).json({ mensagem: "Paciente atualizado!" });
        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await PacienteRepo.delete(id);
            
            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Paciente não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Paciente deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}