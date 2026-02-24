const bcryptjs = require('bcryptjs');
const Enfermeiro = require('../../models/EnfermeiroModel');
const Endereco = require('../../models/EnderecoModel');
const EnfermeiroRepo = require('../../repositories/EnfermeiroRepository');
const RecepcionistaRepo = require('../../repositories/RecepcionistaRepository');
const AdminRepo = require('../../repositories/AdminRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosEnferm = Enfermeiro.validarEnfermeiro(dados);
            if (errosEnferm.length > 0) erros.push(...errosEnferm);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await EnfermeiroRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, uf, coren } = dados;
            
            const enfermeiro = new Enfermeiro(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                telefone,
                uf,
                coren
            );

            await enfermeiro.hashPassword();

            const resultado = await EnfermeiroRepo.create(enfermeiro);

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
            const enfermeiros = await EnfermeiroRepo.findAll();
            res.json(enfermeiros);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const enfermeiro = await EnfermeiroRepo.findById(id);
            if (!enfermeiro) return res.status(404).json({erro: "Enfermeiro não encontrado"});

            res.status(200).json(enfermeiro);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, coren, id_recep, id_enfer, id_admin } = req.body;
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

            if (!id_enfer) return res.status(400).json({erro: "ID enfermeiro obrigatório"});
            const enfermeiro = await EnfermeiroRepo.findById(id_enfer);
            if (!enfermeiro) erros.push("Enfermeiro não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            const dados = { nome, cpf, email, senha: senha || enfermeiro.senha , dataNasc, endereco, telefone, uf, coren };

            const errosValidacao = Enfermeiro.validarEnfermeiro(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await EnfermeiroRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_enfer)) {
                        if (usuarioExistente.cpf === cpf) erros.push("Este CPF já está sendo usado por outro usuário.");
                        if (usuarioExistente.email === email) erros.push("Este E-mail já está sendo usado por outro usuário.");
                    }
                }
            }

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }
            
            const dadosAtualizados = { 
                nome, 
                cpf, 
                email, 
                dataNasc, 
                endereco, 
                telefone, 
                uf, 
                coren 
            };
            
            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

            await EnfermeiroRepo.update(id_enfer, dadosAtualizados);

            res.status(200).json({ mensagem: "Enfermeiro atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await EnfermeiroRepo.delete(id);

            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Enfermeiro não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Enfermeiro deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}