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
    name: '',
    cpf: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    bloodType: 'O+',
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
      name: '',
      cpf: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      address: '',
      bloodType: 'O+',
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
                  <label htmlFor="name" className="label">Nome Completo</label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf" className="label">CPF</label>
                  <input
                    id="cpf"
                    type="text"
                    className="input"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth" className="label">Data de Nascimento</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className="input"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="label">Telefone</label>
                  <input
                    id="phone"
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bloodType" className="label">Tipo Sanguíneo</label>
                  <select
                    id="bloodType"
                    className="select"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="address" className="label">Endereço</label>
                  <input
                    id="address"
                    type="text"
                    className="input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
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
    name: '',
    crm: '',
    specialty: '',
    description: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    try {
      if (editingDoctor) {
        const response = await fetch('http://localhost:3001/medicos', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, id: editingDoctor._id, id_medic: editingDoctor._id })
        });
        if (response.ok) alert('Médico atualizado com sucesso!');
      } else {
        const response = await fetch('http://localhost:3001/medicos', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
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
      name: '',
      crm: '',
      specialty: '',
      description: '',
      phone: '',
      address: '',
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
                  <label htmlFor="name" className="label">Nome Completo</label>
                  <input id="name" type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="crm" className="label">CRM</label>
                  <input id="crm" type="text" className="input" value={formData.crm} onChange={(e) => setFormData({ ...formData, crm: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="specialty" className="label">Especialidade</label>
                  <input id="specialty" type="text" className="input" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="label">Telefone</label>
                  <input id="phone" type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="description" className="label">Descrição</label>
                  <input id="description" type="text" className="input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="address" className="label">Endereço</label>
                  <input id="address" type="text" className="input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
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
  const [formData, setFormData] = useState({ name: '', coren: '', phone: '', address: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    try {
      if (editingNurse) {
        const response = await fetch('http://localhost:3001/enfermeiros', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, id: editingNurse._id })
        });
        if (response.ok) alert('Enfermeiro atualizado com sucesso!');
      } else {
        const response = await fetch('http://localhost:3001/enfermeiros', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        if (response.ok) alert('Enfermeiro cadastrado com sucesso!');
      }
      fetchNurses();
    }
    catch (error) { console.error(error); }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', coren: '', phone: '', address: '' });
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
                <div className="form-group">
                  <label htmlFor="name" className="label">Nome Completo</label>
                  <input id="name" type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="coren" className="label">COREN</label>
                  <input id="coren" type="text" className="input" value={formData.coren} onChange={(e) => setFormData({ ...formData, coren: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="label">Telefone</label>
                  <input id="phone" type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="address" className="label">Endereço</label>
                  <input id="address" type="text" className="input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
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
  const [formData, setFormData] = useState({ name: '', cpf: '', phone: '', address: '' });

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
    setFormData({ name: '', cpf: '', phone: '', address: '' });
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
                <div className="form-group">
                  <label htmlFor="name" className="label">Nome Completo</label>
                  <input id="name" type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf" className="label">CPF</label>
                  <input id="cpf" type="text" className="input" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="label">Telefone</label>
                  <input id="phone" type="tel" className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="address" className="label">Endereço</label>
                  <input id="address" type="text" className="input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
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
