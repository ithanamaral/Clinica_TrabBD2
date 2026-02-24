const bcryptjs = require('bcryptjs');
const Paciente = require('../../models/PacienteModel');
const PacienteRepo = require('../../repositories/PacienteRepository');
const Endereco = require('../../models/EnderecoModel');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');
const AdminRepo = require('../../repositories/AdminRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosPaci = Paciente.validarPaciente(dados);
            if (errosPaci.length > 0) erros.push(...errosPaci);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await PacienteRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, tipoSang } = dados;

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
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, tipoSang, id_recep, id_paci, id_admin } = req.body;
            const erros = [];

            if(id_admin) {
                if (!id_admin) return res.status(400).json({erro: "ID admin obrigatório"});
                const admin = await AdminRepo.findById(id_admin);
                if (!admin) erros.push("Admin não encontrado.");
            } else {
                if (!id_recep) return res.status(400).json({erro: "ID recepcionista obrigatório"});
                const recepcionista = await RecepcionistaRepo.findById(id_recep);
                if (!recepcionista) erros.push("Recepcionista não encontrado.");
            }

            if (!id_paci) return res.status(400).json({ erro: "ID do paciente obrigatório" });
            const paciente = await PacienteRepo.findById(id_paci);
            if (!paciente) erros.push("Paciente não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            const dados = {
                nome, cpf, email, senha: senha || paciente.senha , dataNasc, 
                endereco, telefone, tipoSang
            };

            const errosValidacao = Paciente.validarPaciente(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await PacienteRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_paci)) {
                        if (usuarioExistente.cpf === cpf) erros.push("Este CPF já está sendo usado por outro usuário.");
                        if (usuarioExistente.email === email) erros.push("Este E-mail já está sendo usado por outro usuário.");
                    }
                }
            }

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dadosAtualizados = new Paciente ( 
                nome, 
                cpf, 
                email, 
                dataNasc, 
                endereco, 
                telefone, 
                tipoSang 
            );

            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

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