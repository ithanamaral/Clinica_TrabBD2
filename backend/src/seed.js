require('dotenv').config();
const { connect, getDb } = require('./database');
const { ObjectId } = require('mongodb');

// senha "12345678"
const hashSenha = "$2b$08$wPE5xLM8chqL815ukf96s.KTwc2PF7qxl1.GhqiI8XbSCYgERJGIW";

async function povoarBanco() {
    try {
        console.log("Iniciando conexão com o banco de dados via .env...");
        await connect();
        const db = getDb();

        console.log("Limpando coleções antigas para evitar duplicatas...");
        await db.collection('admins').deleteMany({});
        await db.collection('recepcionistas').deleteMany({});
        await db.collection('medicos').deleteMany({});
        await db.collection('enfermeiros').deleteMany({});
        await db.collection('pacientes').deleteMany({});
        await db.collection('agendamentos').deleteMany({});
        await db.collection('triagens').deleteMany({});
        await db.collection('evolucoes').deleteMany({});
        await db.collection('receitas').deleteMany({});
        await db.collection('exames').deleteMany({});
        await db.collection('medicamentos').deleteMany({});
        await db.collection('dispensas').deleteMany({});

        const idAdmin = new ObjectId();
        const idRecep1 = new ObjectId(), idRecep2 = new ObjectId(), idRecep3 = new ObjectId(), idRecep4 = new ObjectId();
        const idMedic1 = new ObjectId(), idMedic2 = new ObjectId(), idMedic3 = new ObjectId(), idMedic4 = new ObjectId(), idMedic5 = new ObjectId(), idMedic6 = new ObjectId(), idMedic7 = new ObjectId(), idMedic8 = new ObjectId();
        const idEnfer1 = new ObjectId(), idEnfer2 = new ObjectId(), idEnfer3 = new ObjectId(), idEnfer4 = new ObjectId(), idEnfer5 = new ObjectId(), idEnfer6 = new ObjectId();
        const idPaci1 = new ObjectId(), idPaci2 = new ObjectId(), idPaci3 = new ObjectId(), idPaci4 = new ObjectId(), idPaci5 = new ObjectId(), idPaci6 = new ObjectId(), idPaci7 = new ObjectId(), idPaci8 = new ObjectId(), idPaci9 = new ObjectId(), idPaci10 = new ObjectId(), idPaci11 = new ObjectId(), idPaci12 = new ObjectId(), idPaci13 = new ObjectId(), idPaci14 = new ObjectId(), idPaci15 = new ObjectId();
        const idMedicam1 = new ObjectId(), idMedicam2 = new ObjectId(), idMedicam3 = new ObjectId(), idMedicam4 = new ObjectId(), idMedicam5 = new ObjectId(), idMedicam6 = new ObjectId(), idMedicam7 = new ObjectId(), idMedicam8 = new ObjectId(), idMedicam9 = new ObjectId(), idMedicam10 = new ObjectId();
        
        const idAgen1 = new ObjectId(), idAgen2 = new ObjectId(), idAgen3 = new ObjectId(), idAgen4 = new ObjectId(), idAgen5 = new ObjectId(), idAgen6 = new ObjectId(), idAgen7 = new ObjectId(), idAgen8 = new ObjectId(), idAgen9 = new ObjectId(), idAgen10 = new ObjectId(), idAgen11 = new ObjectId(), idAgen12 = new ObjectId(), idAgen13 = new ObjectId(), idAgen14 = new ObjectId(), idAgen15 = new ObjectId();
        const idEvolu1 = new ObjectId(), idEvolu2 = new ObjectId(), idEvolu3 = new ObjectId(), idEvolu4 = new ObjectId(), idEvolu5 = new ObjectId(), idEvolu6 = new ObjectId(), idEvolu7 = new ObjectId(), idEvolu8 = new ObjectId();

        await db.collection('admins').insertOne({
            _id: idAdmin, nome: "Admin", cpf: "000.000.000-00", tipoPerfil: "ADMIN", email: "admin@clinica.com", senha: hashSenha, data_cadastro: new Date()
        });

        await db.collection('recepcionistas').insertMany([
            { _id: idRecep1, nome: "Alice Ferreira", cpf: "111.111.111-11", tipoPerfil: "RECEPCIONISTA", email: "alice@clinica.com", senha: hashSenha, dataNasc: "1995-05-10", telefone: "31911111111", turno: "Manhã", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Centro", rua: "Rua Governador Valadares", cep: "35920-000", numero: 101 } },
            { _id: idRecep2, nome: "Bruno Gomes", cpf: "222.222.222-22", tipoPerfil: "RECEPCIONISTA", email: "bruno@clinica.com", senha: hashSenha, dataNasc: "1990-08-20", telefone: "31922222222", turno: "Tarde", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "Carneirinhos", rua: "Av. Getúlio Vargas", cep: "35930-000", numero: 505 } },
            { _id: idRecep3, nome: "Carla Dias", cpf: "333.111.222-33", tipoPerfil: "RECEPCIONISTA", email: "carla@clinica.com", senha: hashSenha, dataNasc: "1988-03-15", telefone: "31933333333", turno: "Manhã", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Campestre", rua: "Rua Tiradentes", cep: "35900-000", numero: 42 } },
            { _id: idRecep4, nome: "Diego Souza", cpf: "444.222.111-44", tipoPerfil: "RECEPCIONISTA", email: "diego@clinica.com", senha: hashSenha, dataNasc: "1992-11-05", telefone: "31944444444", turno: "Noite", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Bela Vista de Minas", bairro: "Lages", rua: "Rua Principal", cep: "35938-000", numero: 78 } }
        ]);

        await db.collection('medicos').insertMany([
            { _id: idMedic1, nome: "Dr. Carlos Silva", cpf: "333.333.333-33", tipoPerfil: "MEDICO", email: "carlos@clinica.com", senha: hashSenha, dataNasc: "1975-02-15", telefone: "31933333333", uf: "MG", crm: "12345", especialidade: "Cardiologia", descricao: "Especialista em arritmias.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Campestre", rua: "Rua das Margaridas", cep: "35900-000", numero: 10 } },
            { _id: idMedic2, nome: "Dra. Ana Souza", cpf: "444.444.444-44", tipoPerfil: "MEDICO", email: "ana@clinica.com", senha: hashSenha, dataNasc: "1982-11-25", telefone: "31944444444", uf: "MG", crm: "54321", especialidade: "Pediatria", descricao: "Atendimento infantil.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Vila Santa Rosa", rua: "Rua das Rosas", cep: "35920-000", numero: 22 } },
            { _id: idMedic3, nome: "Dr. Paulo Mendes", cpf: "555.555.555-55", tipoPerfil: "MEDICO", email: "paulo@clinica.com", senha: hashSenha, dataNasc: "1980-07-07", telefone: "31955555555", uf: "MG", crm: "98765", especialidade: "Ortopedia", descricao: "Tratamento de traumas.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "República", rua: "Av. Castelo Branco", cep: "35930-050", numero: 300 } },
            { _id: idMedic4, nome: "Dra. Laura Martins", cpf: "123.123.123-12", tipoPerfil: "MEDICO", email: "laura@clinica.com", senha: hashSenha, dataNasc: "1988-09-12", telefone: "31966666666", uf: "MG", crm: "45678", especialidade: "Dermatologia", descricao: "Doenças de pele.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Bela Vista de Minas", bairro: "Sion", rua: "Rua de Cima", cep: "35938-000", numero: 42 } },
            { _id: idMedic5, nome: "Dr. Marcos Rocha", cpf: "234.234.234-23", tipoPerfil: "MEDICO", email: "marcos@clinica.com", senha: hashSenha, dataNasc: "1970-04-10", telefone: "31977777777", uf: "MG", crm: "11223", especialidade: "Neurologia", descricao: "Cefaleias e distúrbios.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "Vila Tanque", rua: "Rua 20", cep: "35930-000", numero: 15 } },
            { _id: idMedic6, nome: "Dra. Julia Castro", cpf: "345.345.345-34", tipoPerfil: "MEDICO", email: "julia@clinica.com", senha: hashSenha, dataNasc: "1985-12-01", telefone: "31988888888", uf: "MG", crm: "33445", especialidade: "Ginecologia", descricao: "Saúde da mulher.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Estação", rua: "Av. da Estação", cep: "35920-000", numero: 500 } },
            { _id: idMedic7, nome: "Dr. Fernando Lima", cpf: "456.456.456-45", tipoPerfil: "MEDICO", email: "fernando@clinica.com", senha: hashSenha, dataNasc: "1978-06-30", telefone: "31999999999", uf: "MG", crm: "55667", especialidade: "Oftalmologia", descricao: "Exames de vista.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Centro", rua: "Rua Água Santa", cep: "35900-010", numero: 120 } },
            { _id: idMedic8, nome: "Dra. Sofia Alves", cpf: "567.567.567-56", tipoPerfil: "MEDICO", email: "sofia.medica@clinica.com", senha: hashSenha, dataNasc: "1981-02-28", telefone: "31910101010", uf: "MG", crm: "77889", especialidade: "Psiquiatria", descricao: "Saúde mental.", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Rio Piracicaba", bairro: "Centro", rua: "Rua da Matriz", cep: "35940-000", numero: 11 } }
        ]);

        await db.collection('enfermeiros').insertMany([
            { _id: idEnfer1, nome: "Mariana Oliveira", cpf: "666.666.666-66", tipoPerfil: "ENFERMEIRO", email: "mariana@clinica.com", senha: hashSenha, dataNasc: "1992-04-12", telefone: "31977777777", uf: "MG", coren: "111222", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Estação", rua: "Rua da Estação", cep: "35920-000", numero: 77 } },
            { _id: idEnfer2, nome: "Julio Cesar", cpf: "777.777.777-77", tipoPerfil: "ENFERMEIRO", email: "julio@clinica.com", senha: hashSenha, dataNasc: "1995-09-30", telefone: "31988888888", uf: "MG", coren: "333444", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Centro", rua: "Rua Tiradentes", cep: "35900-010", numero: 80 } },
            { _id: idEnfer3, nome: "Carla Dias", cpf: "888.888.888-88", tipoPerfil: "ENFERMEIRO", email: "carla.enfer@clinica.com", senha: hashSenha, dataNasc: "1985-01-20", telefone: "31999999999", uf: "MG", coren: "555666", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "Loanda", rua: "Rua Pedro Bicalho", cep: "35930-000", numero: 15 } },
            { _id: idEnfer4, nome: "Roberto Nunes", cpf: "121.212.121-12", tipoPerfil: "ENFERMEIRO", email: "roberto@clinica.com", senha: hashSenha, dataNasc: "1990-11-10", telefone: "31920202020", uf: "MG", coren: "777888", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Bela Vista de Minas", bairro: "Centro", rua: "Rua Nova", cep: "35938-000", numero: 10 } },
            { _id: idEnfer5, nome: "Amanda Costa", cpf: "232.323.232-23", tipoPerfil: "ENFERMEIRO", email: "amanda@clinica.com", senha: hashSenha, dataNasc: "1994-06-05", telefone: "31930303030", uf: "MG", coren: "999000", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Rio Piracicaba", bairro: "Bicas", rua: "Av. Principal", cep: "35940-000", numero: 100 } },
            { _id: idEnfer6, nome: "Tiago Pereira", cpf: "343.434.343-34", tipoPerfil: "ENFERMEIRO", email: "tiago@clinica.com", senha: hashSenha, dataNasc: "1988-02-18", telefone: "31940404040", uf: "MG", coren: "123123", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Serra", rua: "Rua Alto da Serra", cep: "35920-000", numero: 200 } }
        ]);

        await db.collection('pacientes').insertMany([
            { _id: idPaci1, nome: "Lucas Pereira", cpf: "999.999.999-99", tipoPerfil: "PACIENTE", email: "lucas@gmail.com", senha: hashSenha, dataNasc: "2000-01-01", telefone: "31910101010", tipoSang: "O+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Serra", rua: "Rua Alto da Serra", cep: "35920-000", numero: 99 } },
            { _id: idPaci2, nome: "Camila Ribeiro", cpf: "101.101.101-10", tipoPerfil: "PACIENTE", email: "camila@gmail.com", senha: hashSenha, dataNasc: "1998-03-14", telefone: "31920202020", tipoSang: "A-", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Bela Vista de Minas", bairro: "Sion", rua: "Rua das Pedras", cep: "35938-000", numero: 202 } },
            { _id: idPaci3, nome: "Marcos Antonio", cpf: "202.202.202-20", tipoPerfil: "PACIENTE", email: "marcos@gmail.com", senha: hashSenha, dataNasc: "1965-12-10", telefone: "31930303030", tipoSang: "B+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "Vila Tanque", rua: "Rua 20", cep: "35930-000", numero: 14 } },
            { _id: idPaci4, nome: "Sofia Almeida", cpf: "303.303.303-30", tipoPerfil: "PACIENTE", email: "sofia@gmail.com", senha: hashSenha, dataNasc: "2010-06-05", telefone: "31940404040", tipoSang: "AB+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Areão", rua: "Av. Rio Doce", cep: "35900-000", numero: 1000 } },
            { _id: idPaci5, nome: "Renato Russo", cpf: "404.404.404-40", tipoPerfil: "PACIENTE", email: "renato@gmail.com", senha: hashSenha, dataNasc: "1970-10-10", telefone: "31950505050", tipoSang: "O-", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Morada dos Heróis", rua: "Rua dos Expedicionários", cep: "35920-000", numero: 5 } },
            { _id: idPaci6, nome: "Beatriz Lima", cpf: "505.505.505-50", tipoPerfil: "PACIENTE", email: "beatriz@gmail.com", senha: hashSenha, dataNasc: "1995-07-22", telefone: "31960606060", tipoSang: "A+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "Cruzeiro Celeste", rua: "Av. Armando Fajardo", cep: "35930-000", numero: 800 } },
            { _id: idPaci7, nome: "Pedro Henrique", cpf: "606.606.606-60", tipoPerfil: "PACIENTE", email: "pedro@gmail.com", senha: hashSenha, dataNasc: "2005-04-18", telefone: "31970707070", tipoSang: "B-", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Bela Vista", rua: "Rua José de Alencar", cep: "35900-000", numero: 55 } },
            { _id: idPaci8, nome: "Larissa Silva", cpf: "707.707.707-70", tipoPerfil: "PACIENTE", email: "larissa@gmail.com", senha: hashSenha, dataNasc: "1988-09-30", telefone: "31980808080", tipoSang: "O+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Rio Piracicaba", bairro: "Bicas", rua: "Rua Antônio Silva", cep: "35940-000", numero: 10 } },
            { _id: idPaci9, nome: "João Gabriel", cpf: "808.808.808-80", tipoPerfil: "PACIENTE", email: "joao@gmail.com", senha: hashSenha, dataNasc: "1992-12-12", telefone: "31990909090", tipoSang: "AB-", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Bela Vista de Minas", bairro: "Centro", rua: "Praça da Matriz", cep: "35938-000", numero: 1 } },
            { _id: idPaci10, nome: "Letícia Castro", cpf: "909.909.909-90", tipoPerfil: "PACIENTE", email: "leticia@gmail.com", senha: hashSenha, dataNasc: "2001-02-25", telefone: "31912121212", tipoSang: "A+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Vila Santa Rosa", rua: "Rua dos Lírios", cep: "35920-000", numero: 33 } },
            { _id: idPaci11, nome: "Mateus Borges", cpf: "010.010.010-10", tipoPerfil: "PACIENTE", email: "mateus@gmail.com", senha: hashSenha, dataNasc: "1975-08-08", telefone: "31923232323", tipoSang: "O-", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "João Monlevade", bairro: "Lourdes", rua: "Rua do Contorno", cep: "35930-000", numero: 404 } },
            { _id: idPaci12, nome: "Patricia Gomes", cpf: "121.121.121-21", tipoPerfil: "PACIENTE", email: "patricia@gmail.com", senha: hashSenha, dataNasc: "1983-05-14", telefone: "31934343434", tipoSang: "B+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Itabira", bairro: "Pará", rua: "Rua Tiradentes", cep: "35900-000", numero: 90 } },
            { _id: idPaci13, nome: "Gabriel Moura", cpf: "232.232.232-32", tipoPerfil: "PACIENTE", email: "gabriel@gmail.com", senha: hashSenha, dataNasc: "1999-11-11", telefone: "31945454545", tipoSang: "A-", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Nova Era", bairro: "Centro", rua: "Av. Juca Batista", cep: "35920-000", numero: 205 } },
            { _id: idPaci14, nome: "Amanda Santos", cpf: "343.343.343-43", tipoPerfil: "PACIENTE", email: "amanda.santos@gmail.com", senha: hashSenha, dataNasc: "2008-01-20", telefone: "31956565656", tipoSang: "AB+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Rio Piracicaba", bairro: "Centro", rua: "Rua São Miguel", cep: "35940-000", numero: 88 } },
            { _id: idPaci15, nome: "Ricardo Alves", cpf: "454.454.454-54", tipoPerfil: "PACIENTE", email: "ricardo@gmail.com", senha: hashSenha, dataNasc: "1960-03-03", telefone: "31967676767", tipoSang: "O+", data_cadastro: new Date(), endereco: { estado: "MG", cidade: "Bela Vista de Minas", bairro: "Serrinha", rua: "Rua da Serra", cep: "35938-000", numero: 12 } }
        ]);

        await db.collection('medicamentos').insertMany([
            { _id: idMedicam1, nome: "Dipirona 500mg", principio: "Metamizol", qnt_disp: 500, id_enfer: idEnfer1, data_cadastro: new Date() },
            { _id: idMedicam2, nome: "Amoxicilina 875mg", principio: "Amoxicilina", qnt_disp: 200, id_enfer: idEnfer1, data_cadastro: new Date() },
            { _id: idMedicam3, nome: "Losartana 50mg", principio: "Losartana", qnt_disp: 150, id_enfer: idEnfer2, data_cadastro: new Date() },
            { _id: idMedicam4, nome: "Ibuprofeno 600mg", principio: "Ibuprofeno", qnt_disp: 300, id_enfer: idEnfer3, data_cadastro: new Date() },
            { _id: idMedicam5, nome: "Omeprazol 20mg", principio: "Omeprazol", qnt_disp: 450, id_enfer: idEnfer4, data_cadastro: new Date() },
            { _id: idMedicam6, nome: "Paracetamol 750mg", principio: "Paracetamol", qnt_disp: 600, id_enfer: idEnfer5, data_cadastro: new Date() },
            { _id: idMedicam7, nome: "Atenolol 25mg", principio: "Atenolol", qnt_disp: 120, id_enfer: idEnfer6, data_cadastro: new Date() },
            { _id: idMedicam8, nome: "Metformina 850mg", principio: "Metformina", qnt_disp: 350, id_enfer: idEnfer1, data_cadastro: new Date() },
            { _id: idMedicam9, nome: "Simvastatina 20mg", principio: "Simvastatina", qnt_disp: 280, id_enfer: idEnfer2, data_cadastro: new Date() },
            { _id: idMedicam10, nome: "Azitromicina 500mg", principio: "Azitromicina", qnt_disp: 100, id_enfer: idEnfer3, data_cadastro: new Date() }
        ]);

        await db.collection('agendamentos').insertMany([
            { _id: idAgen1, data: "2026-03-01", descricao: "Consulta de rotina", status: true, horario: "08:00", horarioFim: "08:30", id_recep: idRecep1, id_medic: idMedic1, id_paci: idPaci1, data_criacao: new Date() },
            { _id: idAgen2, data: "2026-03-01", descricao: "Dores no joelho", status: true, horario: "09:00", horarioFim: "09:30", id_recep: idRecep1, id_medic: idMedic3, id_paci: idPaci2, data_criacao: new Date() },
            { _id: idAgen3, data: "2026-03-01", descricao: "Acompanhamento mensal", status: true, horario: "10:00", horarioFim: "10:30", id_recep: idRecep2, id_medic: idMedic2, id_paci: idPaci4, data_criacao: new Date() },
            { _id: idAgen4, data: "2026-03-01", descricao: "Manchas no rosto", status: true, horario: "11:00", horarioFim: "11:30", id_recep: idRecep2, id_medic: idMedic4, id_paci: idPaci5, data_criacao: new Date() },
            { _id: idAgen5, data: "2026-03-02", descricao: "Enxaqueca forte", status: true, horario: "14:00", horarioFim: "14:45", id_recep: idRecep3, id_medic: idMedic5, id_paci: idPaci6, data_criacao: new Date() },
            { _id: idAgen6, data: "2026-03-02", descricao: "Rotina ginecológica", status: true, horario: "15:00", horarioFim: "15:30", id_recep: idRecep3, id_medic: idMedic6, id_paci: idPaci8, data_criacao: new Date() },
            { _id: idAgen7, data: "2026-03-02", descricao: "Dificuldade para ler", status: true, horario: "16:00", horarioFim: "16:30", id_recep: idRecep4, id_medic: idMedic7, id_paci: idPaci11, data_criacao: new Date() },
            { _id: idAgen8, data: "2026-03-03", descricao: "Ansiedade generalizada", status: true, horario: "09:00", horarioFim: "10:00", id_recep: idRecep4, id_medic: idMedic8, id_paci: idPaci14, data_criacao: new Date() },
            // Pendentes
            { _id: idAgen9, data: "2026-03-03", descricao: "Pressão alta", status: false, horario: "10:30", horarioFim: "11:00", id_recep: idRecep1, id_medic: idMedic1, id_paci: idPaci15, data_criacao: new Date() },
            { _id: idAgen10, data: "2026-03-04", descricao: "Retorno pediatria", status: false, horario: "08:00", horarioFim: "08:30", id_recep: idRecep2, id_medic: idMedic2, id_paci: idPaci7, data_criacao: new Date() },
            { _id: idAgen11, data: "2026-03-04", descricao: "Dores na lombar", status: false, horario: "09:00", horarioFim: "09:30", id_recep: idRecep3, id_medic: idMedic3, id_paci: idPaci9, data_criacao: new Date() },
            { _id: idAgen12, data: "2026-03-04", descricao: "Espinhas", status: false, horario: "14:00", horarioFim: "14:30", id_recep: idRecep4, id_medic: idMedic4, id_paci: idPaci10, data_criacao: new Date() },
            { _id: idAgen13, data: "2026-03-05", descricao: "Tonturas", status: false, horario: "15:00", horarioFim: "15:30", id_recep: idRecep1, id_medic: idMedic5, id_paci: idPaci12, data_criacao: new Date() },
            { _id: idAgen14, data: "2026-03-05", descricao: "Exames de rotina", status: false, horario: "16:00", horarioFim: "16:30", id_recep: idRecep2, id_medic: idMedic6, id_paci: idPaci13, data_criacao: new Date() },
            { _id: idAgen15, data: "2026-03-05", descricao: "Renovar óculos", status: false, horario: "17:00", horarioFim: "17:30", id_recep: idRecep3, id_medic: idMedic7, id_paci: idPaci3, data_criacao: new Date() }
        ]);

        await db.collection('triagens').insertMany([
            { sinais_vitais: "PA: 120x80 mmHg", altura: 1.75, peso: 70.5, classificacao: "Verde", descricao: "Paciente relata desconforto leve", id_paci: idPaci1, id_enfer: idEnfer1, id_agen: idAgen1, data: new Date() },
            { sinais_vitais: "PA: 130x90 mmHg", altura: 1.60, peso: 65.0, classificacao: "Amarelo", descricao: "Dor intensa no joelho direito", id_paci: idPaci2, id_enfer: idEnfer2, id_agen: idAgen2, data: new Date() },
            { sinais_vitais: "PA: 110x70 mmHg", altura: 1.20, peso: 25.0, classificacao: "Verde", descricao: "Criança ativa, sem febre", id_paci: idPaci4, id_enfer: idEnfer3, id_agen: idAgen3, data: new Date() },
            { sinais_vitais: "PA: 120x80 mmHg", altura: 1.65, peso: 58.0, classificacao: "Verde", descricao: "Paciente queixa de manchas vermelhas", id_paci: idPaci5, id_enfer: idEnfer4, id_agen: idAgen4, data: new Date() },
            { sinais_vitais: "PA: 140x95 mmHg", altura: 1.80, peso: 85.0, classificacao: "Amarelo", descricao: "Cefaleia forte há 3 dias", id_paci: idPaci6, id_enfer: idEnfer5, id_agen: idAgen5, data: new Date() },
            { sinais_vitais: "PA: 125x80 mmHg", altura: 1.68, peso: 62.0, classificacao: "Verde", descricao: "Exame preventivo anual", id_paci: idPaci8, id_enfer: idEnfer6, id_agen: idAgen6, data: new Date() },
            { sinais_vitais: "PA: 135x85 mmHg", altura: 1.70, peso: 78.0, classificacao: "Verde", descricao: "Vista cansada", id_paci: idPaci11, id_enfer: idEnfer1, id_agen: idAgen7, data: new Date() },
            { sinais_vitais: "PA: 120x80 mmHg", altura: 1.62, peso: 55.0, classificacao: "Verde", descricao: "Insônia e ansiedade", id_paci: idPaci14, id_enfer: idEnfer2, id_agen: idAgen8, data: new Date() }
        ]);

        await db.collection('evolucoes').insertMany([
            { _id: idEvolu1, resumo: "Pressão arterial estabilizada. Manter medicação e dieta.", cid_prin: "I10", cid_secun: "", id_medic: idMedic1, id_paci: idPaci1, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu2, resumo: "Paciente apresenta suspeita de lesão meniscal. Necessário ressonância.", cid_prin: "M23.2", cid_secun: "Z10.0", id_medic: idMedic3, id_paci: idPaci2, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu3, resumo: "Desenvolvimento infantil adequado para a idade.", cid_prin: "Z00.1", cid_secun: "", id_medic: idMedic2, id_paci: idPaci4, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu4, resumo: "Dermatite de contato. Prescrito pomada e antialérgico.", cid_prin: "L23", cid_secun: "", id_medic: idMedic4, id_paci: idPaci5, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu5, resumo: "Enxaqueca crônica. Ajuste de medicação profilática.", cid_prin: "G43", cid_secun: "", id_medic: idMedic5, id_paci: idPaci6, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu6, resumo: "Preventivo coletado sem alterações visíveis.", cid_prin: "Z01.4", cid_secun: "", id_medic: idMedic6, id_paci: idPaci8, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu7, resumo: "Presbiopia confirmada. Nova receita de óculos.", cid_prin: "H52.4", cid_secun: "", id_medic: idMedic7, id_paci: idPaci11, data: new Date(), data_criacao: new Date() },
            { _id: idEvolu8, resumo: "Transtorno de ansiedade. Iniciado tratamento medicamentoso.", cid_prin: "F41.1", cid_secun: "", id_medic: idMedic8, id_paci: idPaci14, data: new Date(), data_criacao: new Date() }
        ]);

        await db.collection('receitas').insertMany([
            { descricao: "1. Losartana 50mg - Uso contínuo diário pela manhã.", validade: 180, emissao: "2026-03-01", id_medic: idMedic1, id_evolu: idEvolu1, id_paci: idPaci1 },
            { descricao: "1. Ibuprofeno 600mg - Tomar 1 comprimido de 8/8h em caso de dor.", validade: 30, emissao: "2026-03-01", id_medic: idMedic3, id_evolu: idEvolu2, id_paci: idPaci2 },
            { descricao: "1. Pomada de Hidrocortisona - Aplicar 2x ao dia nas manchas.", validade: 30, emissao: "2026-03-01", id_medic: idMedic4, id_evolu: idEvolu4, id_paci: idPaci5 },
            { descricao: "1. Amitriptilina 25mg - Tomar 1 comprimido à noite.", validade: 90, emissao: "2026-03-02", id_medic: idMedic5, id_evolu: idEvolu5, id_paci: idPaci6 },
            { descricao: "1. Lente +1.50 para perto (ambos os olhos).", validade: 365, emissao: "2026-03-02", id_medic: idMedic7, id_evolu: idEvolu7, id_paci: idPaci11 },
            { descricao: "1. Escitalopram 10mg - Tomar 1 comprimido pela manhã.", validade: 180, emissao: "2026-03-03", id_medic: idMedic8, id_evolu: idEvolu8, id_paci: idPaci14 }
        ]);

        await db.collection('exames').insertMany([
            { status: true, arq_resultado: "resultado_ecg_lucas.pdf", tipo_exame: "Eletrocardiograma", id_medic: idMedic1, id_evolu: idEvolu1, id_paci: idPaci1, data: new Date() },
            { status: false, arq_resultado: "", tipo_exame: "Ressonância Magnética do Joelho", id_medic: idMedic3, id_evolu: idEvolu2, id_paci: idPaci2, data: new Date() },
            { status: false, arq_resultado: "", tipo_exame: "Hemograma Completo Infantil", id_medic: idMedic2, id_evolu: idEvolu3, id_paci: idPaci4, data: new Date() },
            { status: false, arq_resultado: "", tipo_exame: "Tomografia de Crânio", id_medic: idMedic5, id_evolu: idEvolu5, id_paci: idPaci6, data: new Date() },
            { status: true, arq_resultado: "resultado_preventivo_larissa.pdf", tipo_exame: "Papanicolau", id_medic: idMedic6, id_evolu: idEvolu6, id_paci: idPaci8, data: new Date() },
            { status: true, arq_resultado: "resultado_sangue_amanda.pdf", tipo_exame: "Dosagem de Vitaminas", id_medic: idMedic8, id_evolu: idEvolu8, id_paci: idPaci14, data: new Date() }
        ]);

        await db.collection('dispensas').insertMany([
            { id_medicam: idMedicam3, id_paci: idPaci1, id_enfer: idEnfer1, quantidade: 30, data: new Date() }, // Losartana
            { id_medicam: idMedicam4, id_paci: idPaci2, id_enfer: idEnfer2, quantidade: 15, data: new Date() }, // Ibuprofeno
            { id_medicam: idMedicam6, id_paci: idPaci4, id_enfer: idEnfer3, quantidade: 10, data: new Date() }, // Paracetamol
            { id_medicam: idMedicam1, id_paci: idPaci6, id_enfer: idEnfer4, quantidade: 20, data: new Date() }, // Dipirona
            { id_medicam: idMedicam5, id_paci: idPaci8, id_enfer: idEnfer5, quantidade: 30, data: new Date() }  // Omeprazol
        ]);

        console.log("Todos os usuários criados com a senha: 12345678");
    
        process.exit(0);

    } catch (error) {
        console.error("Erro ao povoar banco de dados:", error);
        process.exit(1);
    }
}

povoarBanco();