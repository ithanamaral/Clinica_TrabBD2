import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import '../../styles/UserManagement.css';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div>
      <div className="page-header">
        <h1>Gestão de Usuários</h1>
        <p>Gerencie pacientes, médicos, enfermeiros e recepcionistas</p>
      </div>

      <div className="tabs">
        <div className="tabs-list">
          <button
            className={`tab-trigger ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Pacientes
          </button>
          <button
            className={`tab-trigger ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Médicos
          </button>
          <button
            className={`tab-trigger ${activeTab === 'nurses' ? 'active' : ''}`}
            onClick={() => setActiveTab('nurses')}
          >
            Enfermeiros
          </button>
          <button
            className={`tab-trigger ${activeTab === 'receptionists' ? 'active' : ''}`}
            onClick={() => setActiveTab('receptionists')}
          >
            Recepcionistas
          </button>
        </div>

        <div className={`tab-content ${activeTab === 'patients' ? 'active' : ''}`}>
          <PatientsTab />
        </div>

        <div className={`tab-content ${activeTab === 'doctors' ? 'active' : ''}`}>
          <DoctorsTab />
        </div>

        <div className={`tab-content ${activeTab === 'nurses' ? 'active' : ''}`}>
          <NursesTab />
        </div>

        <div className={`tab-content ${activeTab === 'receptionists' ? 'active' : ''}`}>
          <ReceptionistsTab />
        </div>
      </div>
    </div>
  );
};

const PatientsTab = () => {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const response = await fetch('http://localhost:3001/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '', // Campo obrigatório, segundo o Model do tulio
    dataNasc: '',
    telefone: '',
    tipoSang: 'O+',
    endereco: {
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      cep: '',
      numero: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    try {
      if (editingPatient) {
        const response = await fetch('http://localhost:3001/pacientes', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, id: editingPatient._id, id_paci: editingPatient._id })
        });
        if (response.ok) alert('Paciente atualizado com sucesso!');
      } else {
        const response = await fetch('http://localhost:3001/pacientes', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        if (response.ok) alert('Paciente cadastrado com sucesso!');
      }
      fetchPatients();
    }
    catch (error) { console.error(error); }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      dataNasc: '',
      telefone: '',
      tipoSang: 'O+',
      endereco: {
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        cep: '',
        numero: ''
      }
    });
    setEditingPatient(null);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        const response = await fetch('http://localhost:3001/pacientes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ id })
        });
        if (response.ok) {
          alert('Paciente excluído com sucesso!');
          fetchPatients();
        }
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div>
      <div className="actions-bar">
        <button
          className="btn btn-success"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Adicionar Paciente
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Tipo Sanguíneo</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  Nenhum paciente cadastrado
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.nome}</td>
                  <td>{patient.cpf}</td>
                  <td>{patient.email}</td>
                  <td>{patient.tipoSang}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-ghost btn-icon btn-edit"
                        onClick={() => handleEdit(patient)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-ghost btn-icon btn-delete"
                        onClick={() => handleDelete(patient._id)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">
              {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
            </h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome" className="label">Nome Completo</label>
                  <input id="nome" type="text" className="input" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf" className="label">CPF</label>
                  <input id="cpf" type="text" className="input" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="label">Email</label>
                  <input id="email" type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="senha" className="label">Senha de Acesso</label>
                  <input id="senha" type="password" className="input" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required={!editingPatient} placeholder={editingPatient ? 'Deixe em branco para não alterar' : ''} />
                </div>
                <div className="form-group">
                  <label htmlFor="dataNasc" className="label">Data de Nascimento</label>
                  <input id="dataNasc" type="date" className="input" value={formData.dataNasc} onChange={(e) => setFormData({ ...formData, dataNasc: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone" className="label">Telefone</label>
                  <input id="telefone" type="tel" className="input" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="tipoSang" className="label">Tipo Sanguíneo</label>
                  <select id="tipoSang" className="select" value={formData.tipoSang} onChange={(e) => setFormData({ ...formData, tipoSang: e.target.value })}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* --- ENDEREÇO --- */}
                <div className="form-group form-group-full">
                  <h3 style={{ marginBottom: '15px', color: '#1B5E20', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                    Endereço
                  </h3>
                  <div className="form-grid" style={{ marginTop: '10px' }}>
                    <div className="form-group">
                      <label htmlFor="cep" className="label">CEP</label>
                      <input id="cep" type="text" className="input" value={formData.endereco.cep} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="estado" className="label">Estado (UF)</label>
                      <input id="estado" type="text" className="input" maxLength="2" placeholder="Ex: MG" value={formData.endereco.estado} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cidade" className="label">Cidade</label>
                      <input id="cidade" type="text" className="input" value={formData.endereco.cidade} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bairro" className="label">Bairro</label>
                      <input id="bairro" type="text" className="input" value={formData.endereco.bairro} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="rua" className="label">Rua</label>
                      <input id="rua" type="text" className="input" value={formData.endereco.rua} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="numero" className="label">Número</label>
                      <input id="numero" type="text" className="input" value={formData.endereco.numero} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} required />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setIsOpen(false); resetForm(); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  {editingPatient ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorsTab = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const response = await fetch('http://localhost:3001/medicos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    dataNasc: '',
    telefone: '',
    uf: '',
    crm: '',
    especialidade: '',
    descricao: '',
    endereco: { 
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      cep: '',
      numero: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = {
      ...formData,
      telefone: Number(formData.telefone),
      crm: Number(formData.crm),
      endereco: {
        ...formData.endereco,
        numero: Number(formData.endereco.numero)
      }
    };

    try {
      if (editingDoctor) {
        const response = await fetch('http://localhost:3001/medicos', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...payload, id: editingDoctor._id, id_medic: editingDoctor._id })
        });
        if (response.ok) alert('Médico atualizado com sucesso!');
      } else {
        const response = await fetch('http://localhost:3001/medicos', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (response.ok) alert('Médico cadastrado com sucesso!');
      }
      fetchDoctors();
    }
    catch (error) { console.error(error); }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    dataNasc: '',
    telefone: '',
    uf: '',
    crm: '',
    especialidade: '',
    descricao: '',
    endereco: { 
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      cep: '',
      numero: ''
    }
    });
    setEditingDoctor(null);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData(doctor);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este médico?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        const response = await fetch('http://localhost:3001/medicos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ id })
        });
        if (response.ok) {
          alert('Médico excluído com sucesso!');
          fetchDoctors();
        }
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div>
      <div className="actions-bar">
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Adicionar Médico
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">Nenhum médico cadastrado</td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.nome}</td>
                  <td>{doctor.crm}</td>
                  <td>{doctor.especialidade}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(doctor)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(doctor._id)} title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{editingDoctor ? 'Editar Médico' : 'Novo Médico'}</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome" className="label">Nome Completo</label>
                  <input id="nome" type="text" className="input" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf" className="label">CPF</label>
                  <input id="cpf" type="text" className="input" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="label">Email</label>
                  <input id="email" type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="senha" className="label">Senha</label>
                  <input id="senha" type="password" className="input" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required={!editingDoctor} />
                </div>
                <div className="form-group">
                  <label htmlFor="dataNasc" className="label">Data Nasc.</label>
                  <input id="dataNasc" type="date" className="input" value={formData.dataNasc} onChange={(e) => setFormData({ ...formData, dataNasc: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone" className="label">Telefone</label>
                  <input id="telefone" type="tel" className="input" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="uf" className="label">UF (Conselho)</label>
                  <input id="uf" type="text" className="input" maxLength="2" value={formData.uf} onChange={(e) => setFormData({ ...formData, uf: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="crm" className="label">CRM</label>
                  <input id="crm" type="text" className="input" value={formData.crm} onChange={(e) => setFormData({ ...formData, crm: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="especialidade" className="label">Especialidade</label>
                  <input id="especialidade" type="text" className="input" value={formData.especialidade} onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="descricao" className="label">Descrição</label>
                  <input id="descricao" type="text" className="input" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                </div>

                {/* ENDEREÇO (Igual para todos) */}
                <div className="form-group form-group-full">
                  <h3 style={{ marginBottom: '15px', color: '#1B5E20', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Endereço</h3>
                  <div className="form-grid" style={{ marginTop: '10px' }}>
                    <div className="form-group"><label className="label">CEP</label><input type="text" className="input" value={formData.endereco.cep} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Estado (UF)</label><input type="text" className="input" maxLength="2" placeholder="Ex: MG" value={formData.endereco.estado} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Cidade</label><input type="text" className="input" value={formData.endereco.cidade} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Bairro</label><input type="text" className="input" value={formData.endereco.bairro} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Rua</label><input type="text" className="input" value={formData.endereco.rua} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Número</label><input type="text" className="input" value={formData.endereco.numero} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} required /></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn btn-success">{editingDoctor ? 'Atualizar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};




const NursesTab = () => {
  const [nurses, setNurses] = useState([]);

  const fetchNurses = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const response = await fetch('http://localhost:3001/enfermeiros', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNurses(data);
      }
    } catch (error) {
      console.error('Erro ao buscar enfermeiros:', error);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    dataNasc: '',
    telefone: '',
    uf: '',
    coren: '',
    endereco: { 
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      cep: '',
      numero: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // Pacote com a "gambiarra" para o backend da enfermeira aceitar
    const payload = {
      ...formData,
      telefone: Number(formData.telefone),
      coren: Number(formData.coren)
    };

    try {
      if (editingNurse) {
        const response = await fetch('http://localhost:3001/enfermeiros', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...payload, id: editingNurse._id })
        });
        if (response.ok) alert('Enfermeiro atualizado com sucesso!');
      } else {
        const response = await fetch('http://localhost:3001/enfermeiros', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (response.ok) alert('Enfermeiro cadastrado com sucesso!');
      }
      fetchNurses();
    } catch (error) { console.error(error); }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      dataNasc: '',
      telefone: '',
      uf: '',
      coren: '',
      endereco: {
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        cep: '',
        numero: ''
      }
    });
    setEditingNurse(null);
  };

  const handleEdit = (nurse) => {
    setEditingNurse(nurse);
    setFormData(nurse);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este enfermeiro?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        const response = await fetch('http://localhost:3001/enfermeiros', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ id })
        });
        if (response.ok) {
          alert('Enfermeiro excluído com sucesso!');
          fetchNurses();
        }
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div>
      <div className="actions-bar">
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Adicionar Enfermeiro
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>COREN</th>
              <th>Telefone</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {nurses.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">Nenhum enfermeiro cadastrado</td>
              </tr>
            ) : (
              nurses.map((nurse) => (
                <tr key={nurse._id}>
                  <td>{nurse.nome}</td>
                  <td>{nurse.coren}</td>
                  <td>{nurse.telefone}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(nurse)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(nurse._id)} title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{editingNurse ? 'Editar Enfermeiro' : 'Novo Enfermeiro'}</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* CAMPOS BASE DA CLASSE USUARIO */}
                <div className="form-group"><label className="label">Nome Completo</label><input type="text" className="input" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required /></div>
                <div className="form-group"><label className="label">CPF</label><input type="text" className="input" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Email</label><input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Senha</label><input type="password" className="input" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required={!editingNurse} /></div>
                <div className="form-group"><label className="label">Data Nasc.</label><input type="date" className="input" value={formData.dataNasc} onChange={(e) => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Telefone</label><input type="tel" className="input" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                
                {/* CAMPOS ESPECÍFICOS ENFERMEIRO */}
                <div className="form-group"><label className="label">UF (Conselho)</label><input type="text" className="input" maxLength="2" value={formData.uf} onChange={(e) => setFormData({ ...formData, uf: e.target.value })} required /></div>
                <div className="form-group"><label className="label">COREN</label><input type="text" className="input" value={formData.coren} onChange={(e) => setFormData({ ...formData, coren: e.target.value })} required /></div>

                {/* ENDEREÇO */}
                <div className="form-group form-group-full">
                  <h3 style={{ marginBottom: '15px', color: '#1B5E20', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Endereço</h3>
                  <div className="form-grid" style={{ marginTop: '10px' }}>
                    <div className="form-group"><label className="label">CEP</label><input type="text" className="input" value={formData.endereco.cep} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Estado (UF)</label><input type="text" className="input" maxLength="2" placeholder='Ex: MG' value={formData.endereco.estado} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Cidade</label><input type="text" className="input" value={formData.endereco.cidade} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Bairro</label><input type="text" className="input" value={formData.endereco.bairro} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Rua</label><input type="text" className="input" value={formData.endereco.rua} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Número</label><input type="text" className="input" value={formData.endereco.numero} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} required /></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn btn-success">{editingNurse ? 'Atualizar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceptionistsTab = () => {
  const [receptionists, setReceptionists] = useState([]);

  const fetchReceptionists = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const response = await fetch('http://localhost:3001/recepcionistas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReceptionists(data);
      }
    } catch (error) {
      console.error('Erro ao buscar recepcionistas:', error);
    }
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    dataNasc: '',
    telefone: '',
    turno: 'Manhã', // Valor padrão para o select
    endereco: {
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      cep: '',
      numero: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    try {
      if (editingReceptionist) {
        const response = await fetch('http://localhost:3001/recepcionistas', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, id: editingReceptionist._id })
        });
        if (response.ok) alert('Recepcionista atualizado com sucesso!');
      } else {
        const response = await fetch('http://localhost:3001/recepcionistas', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        if (response.ok) alert('Recepcionista cadastrado com sucesso!');
      }
      fetchReceptionists();
    }
    catch (error) { console.error(error); }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      dataNasc: '',
      telefone: '',
      turno: 'Manhã',
      endereco: {
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        cep: '',
        numero: ''
      }
    });
    setEditingReceptionist(null);
  };

  const handleEdit = (receptionist) => {
    setEditingReceptionist(receptionist);
    setFormData(receptionist);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este recepcionista?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        const response = await fetch('http://localhost:3001/recepcionistas', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ id })
        });
        if (response.ok) {
          alert('Recepcionista excluído com sucesso!');
          fetchReceptionists();
        }
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div>
      <div className="actions-bar">
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Adicionar Recepcionista
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {receptionists.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">Nenhum recepcionista cadastrado</td>
              </tr>
            ) : (
              receptionists.map((receptionist) => (
                <tr key={receptionist._id}>
                  <td>{receptionist.nome}</td>
                  <td>{receptionist.cpf}</td>
                  <td>{receptionist.telefone}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(receptionist)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(receptionist._id)} title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{editingReceptionist ? 'Editar Recepcionista' : 'Novo Recepcionista'}</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* CAMPOS BASE DA CLASSE USUARIO */}
                <div className="form-group"><label className="label">Nome Completo</label><input type="text" className="input" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required /></div>
                <div className="form-group"><label className="label">CPF</label><input type="text" className="input" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Email</label><input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Senha</label><input type="password" className="input" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required={!editingReceptionist} /></div>
                <div className="form-group"><label className="label">Data Nasc.</label><input type="date" className="input" value={formData.dataNasc} onChange={(e) => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                <div className="form-group"><label className="label">Telefone</label><input type="tel" className="input" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                
                {/* CAMPOS ESPECÍFICOS RECEPCIONISTA */}
                <div className="form-group">
                  <label className="label">Turno</label>
                  <select className="select" value={formData.turno} onChange={(e) => setFormData({ ...formData, turno: e.target.value })}>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>

                {/* ENDEREÇO */}
                <div className="form-group form-group-full">
                  <h3 style={{ marginBottom: '15px', color: '#1B5E20', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Endereço</h3>
                  <div className="form-grid" style={{ marginTop: '10px' }}>
                    <div className="form-group"><label className="label">CEP</label><input type="text" className="input" value={formData.endereco.cep} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Estado (UF)</label><input type="text" className="input" maxLength="2" placeholder='Ex: MG' value={formData.endereco.estado} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Cidade</label><input type="text" className="input" value={formData.endereco.cidade} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Bairro</label><input type="text" className="input" value={formData.endereco.bairro} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Rua</label><input type="text" className="input" value={formData.endereco.rua} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })} required /></div>
                    <div className="form-group"><label className="label">Número</label><input type="text" className="input" value={formData.endereco.numero} onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} required /></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn btn-success">{editingReceptionist ? 'Atualizar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
