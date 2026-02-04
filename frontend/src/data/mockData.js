// Data de referência: 2026-02-04 (Quarta-feira)

export const mockPatients = [
  {
    id: '1',
    name: 'Maria Silva Oliveira',
    cpf: '123.456.789-00',
    email: 'maria.silva@email.com',
    dateOfBirth: '1985-03-15',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    bloodType: 'O+',
  },
  {
    id: '2',
    name: 'João Pedro Santos',
    cpf: '987.654.321-00',
    email: 'joao.santos@email.com',
    dateOfBirth: '1990-07-22',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 456 - São Paulo, SP',
    bloodType: 'A+',
  },
  {
    id: '3',
    name: 'Ana Paula Costa',
    cpf: '456.789.123-00',
    email: 'ana.costa@email.com',
    dateOfBirth: '1978-11-30',
    phone: '(11) 99876-5432',
    address: 'Rua da Consolação, 789 - São Paulo, SP',
    bloodType: 'B+',
  },
  {
    id: '4',
    name: 'Carlos Roberto Lima',
    cpf: '222.333.444-55',
    email: 'carlos.lima@email.com',
    dateOfBirth: '1965-05-10',
    phone: '(11) 97777-8888',
    address: 'Rua Augusta, 1010 - São Paulo, SP',
    bloodType: 'AB-',
  },
  {
    id: '5',
    name: 'Beatriz Souza',
    cpf: '333.444.555-66',
    email: 'beatriz.souza@email.com',
    dateOfBirth: '2002-12-01',
    phone: '(11) 96666-5555',
    address: 'Alameda Santos, 2020 - São Paulo, SP',
    bloodType: 'O-',
  },
  {
    id: '6',
    name: 'Ricardo Almeida',
    cpf: '444.555.666-77',
    email: 'ricardo.almeida@email.com',
    dateOfBirth: '1995-08-20',
    phone: '(11) 95555-4444',
    address: 'Rua Haddock Lobo, 303 - São Paulo, SP',
    bloodType: 'A-',
  }
];

export const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Carlos Mendes',
    crm: 'CRM/SP 123456',
    specialty: 'Cardiologia',
    description: 'Especialista em cardiologia clínica e ecocardiografia.',
    phone: '(11) 3456-7890',
    address: 'Centro Médico Unidade I - Bloco A',
  },
  {
    id: '2',
    name: 'Dra. Patrícia Lima',
    crm: 'CRM/SP 789012',
    specialty: 'Pediatria',
    description: 'Atendimento pediátrico integral e hebiatria.',
    phone: '(11) 3456-7891',
    address: 'Centro Médico Unidade I - Bloco B',
  },
  {
    id: '3',
    name: 'Dr. Roberto Alves',
    crm: 'CRM/SP 345678',
    specialty: 'Ortopedia',
    description: 'Especialista em traumatologia e cirurgia de joelho.',
    phone: '(11) 3456-7892',
    address: 'Centro Médico Unidade I - Bloco C',
  },
  {
    id: '4',
    name: 'Dra. Helena Souza',
    crm: 'CRM/SP 901234',
    specialty: 'Ginecologia',
    description: 'Ginecologia e obstetrícia com foco em gestação de alto risco.',
    phone: '(11) 3456-7893',
    address: 'Centro Médico Unidade II - Sala 102',
  }
];

export const mockNurses = [
  {
    id: '1',
    name: 'Fernanda Souza',
    coren: 'COREN/SP 123456',
    phone: '(11) 98765-1111',
    address: 'Rua da Saúde, 100 - São Paulo, SP',
  },
  {
    id: '2',
    name: 'Lucas Oliveira',
    coren: 'COREN/SP 789012',
    phone: '(11) 98765-2222',
    address: 'Av. da Medicina, 200 - São Paulo, SP',
  },
  {
    id: '3',
    name: 'Camila Ferreira',
    coren: 'COREN/SP 345678',
    phone: '(11) 98765-3333',
    address: 'Rua Central, 50 - São Paulo, SP',
  }
];

export const mockReceptionists = [
  {
    id: '1',
    name: 'Júlia Martins',
    cpf: '111.222.333-44',
    phone: '(11) 98765-4444',
    address: 'Rua Central, 50 - São Paulo, SP',
  },
  {
    id: '2',
    name: 'Pedro Rocha',
    cpf: '555.666.777-88',
    phone: '(11) 98765-5555',
    address: 'Av. Principal, 150 - São Paulo, SP',
  }
];

export const mockAppointments = [
  // Ontem (Histórico)
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2026-02-03',
    time: '09:00',
    description: 'Consulta de retorno para avaliação de exames.',
    status: 'concluido',
    triageCompleted: true,
  },
  {
    id: '2',
    patientId: '4',
    doctorId: '3',
    date: '2026-02-03',
    time: '14:30',
    description: 'Dor lombar aguda após esforço físico.',
    status: 'concluido',
    triageCompleted: true,
  },
  // Hoje (Manhã - Concluídos/Em andamento)
  {
    id: '3',
    patientId: '2',
    doctorId: '2',
    date: '2026-02-04',
    time: '08:30',
    description: 'Febre e tosse persistente há 2 dias.',
    status: 'concluido',
    triageCompleted: true,
  },
  {
    id: '4',
    patientId: '3',
    doctorId: '1',
    date: '2026-02-04',
    time: '10:00',
    description: 'Check-up anual cardiológico.',
    status: 'pendente',
    triageCompleted: true,
  },
  {
    id: '5',
    patientId: '5',
    doctorId: '4',
    date: '2026-02-04',
    time: '11:15',
    description: 'Consulta ginecológica de rotina.',
    status: 'pendente',
    triageCompleted: true,
  },
  // Hoje (Tarde - Pendentes)
  {
    id: '6',
    patientId: '6',
    doctorId: '3',
    date: '2026-02-04',
    time: '14:00',
    description: 'Torção no tornozelo esquerdo.',
    status: 'pendente',
    triageCompleted: false,
  },
  {
    id: '7',
    patientId: '1',
    doctorId: '2',
    date: '2026-02-04',
    time: '15:30',
    description: 'Acompanhamento de tratamento pediátrico (dependente).',
    status: 'pendente',
    triageCompleted: false,
  },
  // Amanhã (Futuro)
  {
    id: '8',
    patientId: '4',
    doctorId: '1',
    date: '2026-02-05',
    time: '09:00',
    description: 'Avaliação de risco cirúrgico.',
    status: 'pendente',
    triageCompleted: false,
  }
];

export const mockTriages = [
  {
    id: 't1',
    appointmentId: '1',
    bloodPressure: '120/80',
    temperature: 36.6,
    weight: 68.5,
    height: 1.65,
    riskClassification: 'green',
    observations: 'Paciente assintomático, estável.',
  },
  {
    id: 't2',
    appointmentId: '2',
    bloodPressure: '135/90',
    temperature: 36.8,
    weight: 85.0,
    height: 1.80,
    riskClassification: 'yellow',
    observations: 'Dor intensa na região lombar (Escala 7/10).',
  },
  {
    id: 't3',
    appointmentId: '3',
    bloodPressure: '110/70',
    temperature: 38.2,
    weight: 25.0,
    height: 1.25,
    riskClassification: 'yellow',
    observations: 'Paciente febril, tosse produtiva.',
  },
  {
    id: 't4',
    appointmentId: '4',
    bloodPressure: '140/95',
    temperature: 36.4,
    weight: 78.0,
    height: 1.72,
    riskClassification: 'green',
    observations: 'Relata palpitações ocasionais.',
  },
  {
    id: 't5',
    appointmentId: '5',
    bloodPressure: '120/80',
    temperature: 36.5,
    weight: 62.0,
    height: 1.68,
    riskClassification: 'green',
    observations: 'Paciente sem queixas agudas.',
  }
];

export const mockMedications = [
  { id: '1', name: 'Paracetamol 500mg', activePrinciple: 'Paracetamol', quantity: 120 },
  { id: '2', name: 'Ibuprofeno 600mg', activePrinciple: 'Ibuprofeno', quantity: 85 },
  { id: '3', name: 'Amoxicilina 500mg', activePrinciple: 'Amoxicilina', quantity: 45 },
  { id: '4', name: 'Losartana 50mg', activePrinciple: 'Losartana Potássica', quantity: 200 },
  { id: '5', name: 'Dipirona 500mg/mL', activePrinciple: 'Dipirona Sódica', quantity: 30 },
  { id: '6', name: 'Omeprazol 20mg', activePrinciple: 'Omeprazol', quantity: 150 },
  { id: '7', name: 'Salbutamol 100mcg', activePrinciple: 'Sulfato de Salbutamol', quantity: 12 },
  { id: '8', name: 'Atorvastatina 20mg', activePrinciple: 'Atorvastatina Calcica', quantity: 90 },
  { id: '9', name: 'Metformina 850mg', activePrinciple: 'Cloridrato de Metformina', quantity: 180 },
  { id: '10', name: 'Prednisona 20mg', activePrinciple: 'Prednisona', quantity: 55 }
];

export const mockPrescriptions = [
  {
    id: 'p1',
    appointmentId: '1',
    medication: 'Losartana 50mg',
    dosage: '1 comprimido via oral 1x ao dia pela manhã.',
    validity: 180,
  },
  {
    id: 'p2',
    appointmentId: '3',
    medication: 'Amoxicilina 500mg',
    dosage: '1 cápsula via oral de 8 em 8 horas por 7 dias.',
    validity: 10,
  },
  {
    id: 'p3',
    appointmentId: '3',
    medication: 'Paracetamol 500mg',
    dosage: '1 comprimido via oral em caso de febre ou dor (máx 4x dia).',
    validity: 30,
  }
];

export const mockExamRequests = [
  {
    id: 'e1',
    appointmentId: '1',
    examType: 'Ecocardiograma Transtorácico',
    urgent: false,
  },
  {
    id: 'e2',
    appointmentId: '4',
    examType: 'Eletrocardiograma (ECG)',
    urgent: true,
  },
  {
    id: 'e3',
    appointmentId: '4',
    examType: 'Perfil Lipídico Completo',
    urgent: false,
  }
];

export const mockMedicalRecords = [
  {
    id: 'm1',
    appointmentId: '1',
    evolution: 'Paciente retornou para avaliação. Exames de imagem normais. Mantida conduta medicamentosa.',
    mainCid: 'I10 - Hipertensão essencial (primária)',
    secondaryCid: 'E78.0 - Hipercolesterolemia pura',
  },
  {
    id: 'm2',
    appointmentId: '2',
    evolution: 'Paciente com quadro de lombalgia mecânica aguda. Prescrito repouso e analgesia. Orientado fisioterapia.',
    mainCid: 'M54.5 - Dor lombar baixa',
    secondaryCid: '',
  },
  {
    id: 'm3',
    appointmentId: '3',
    evolution: 'Criança com quadro gripal evoluindo para amigdalite bacteriana. Iniciada antibioticoterapia.',
    mainCid: 'J03.9 - Amigdalite aguda não especificada',
    secondaryCid: 'R50.9 - Febre não especificada',
  }
];
