import React, { useState, useEffect, useCallback } from 'react';
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
          <button className={`tab-trigger ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>Pacientes</button>
          <button className={`tab-trigger ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>Médicos</button>
          <button className={`tab-trigger ${activeTab === 'nurses' ? 'active' : ''}`} onClick={() => setActiveTab('nurses')}>Enfermeiros</button>
          <button className={`tab-trigger ${activeTab === 'receptionists' ? 'active' : ''}`} onClick={() => setActiveTab('receptionists')}>Recepcionistas</button>
        </div>

        <div className={`tab-content ${activeTab === 'patients' ? 'active' : ''}`}><PatientsTab /></div>
        <div className={`tab-content ${activeTab === 'doctors' ? 'active' : ''}`}><DoctorsTab /></div>
        <div className={`tab-content ${activeTab === 'nurses' ? 'active' : ''}`}><NursesTab /></div>
        <div className={`tab-content ${activeTab === 'receptionists' ? 'active' : ''}`}><ReceptionistsTab /></div>
      </div>
    </div>
  );
};

/* --- COMPONENTE ENDEREÇO REUTILIZÁVEL --- */
const AddressForm = ({ endereco, onChange }) => (
  <div className="form-group form-group-full">
    <h3 style={{ marginBottom: '15px', color: '#1B5E20', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '10px' }}>
      Endereço
    </h3>
    <div className="form-grid">
      <div className="form-group">
        <label className="label">CEP</label>
        <input type="text" className="input" value={endereco.cep} onChange={(e) => onChange({ ...endereco, cep: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Estado (UF)</label>
        <input type="text" className="input" maxLength="2" placeholder="Ex: MG" value={endereco.estado} onChange={(e) => onChange({ ...endereco, estado: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Cidade</label>
        <input type="text" className="input" value={endereco.cidade} onChange={(e) => onChange({ ...endereco, cidade: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Bairro</label>
        <input type="text" className="input" value={endereco.bairro} onChange={(e) => onChange({ ...endereco, bairro: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Rua</label>
        <input type="text" className="input" value={endereco.rua} onChange={(e) => onChange({ ...endereco, rua: e.target.value })} required />
      </div>
      <div className="form-group">
        <label className="label">Número</label>
        <input type="text" className="input" value={endereco.numero} onChange={(e) => onChange({ ...endereco, numero: e.target.value })} required />
      </div>
    </div>
  </div>
);

/* --- ABA PACIENTES --- */
const PatientsTab = () => {
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', tipoSang: 'O+',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchPatients = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/pacientes', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setPatients(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const resetForm = () => {
    setFormData({ nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', tipoSang: 'O+', endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setEditingPatient(null);
  };

  const handleEdit = (p) => {
    setEditingPatient(p);
    setFormData({ ...p, dataNasc: p.dataNasc ? p.dataNasc.split('T')[0] : '', senha: '', endereco: p.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Clinica:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData };
    try {
      if (editingPatient) {
        payload.id_paci = editingPatient._id;
        if (authData?.role === 'admin') payload.id_admin = authData.id;
        else payload.id_recep = authData.id;
        await fetch('http://localhost:3001/pacientes', { method: 'PUT', headers, body: JSON.stringify(payload) });
      } else {
        await fetch('http://localhost:3001/pacientes', { method: 'POST', headers, body: JSON.stringify(payload) });
      }
      fetchPatients(); setIsOpen(false); resetForm();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir paciente?')) return;
    const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
    await fetch('http://localhost:3001/pacientes', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id }) });
    fetchPatients();
  };

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Paciente</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>CPF</th><th>Email</th><th>Sangue</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{patients.map(p => (<tr key={p._id}><td>{p.nome}</td><td>{p.cpf}</td><td>{p.email}</td><td>{p.tipoSang}</td><td><div className="table-actions"><button className="btn-ghost btn-icon" onClick={() => handleEdit(p)}><Pencil size={16} /></button><button className="btn-ghost btn-icon" onClick={() => handleDelete(p._id)}><Trash2 size={16} /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => { setIsOpen(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingPatient ? 'Editar Paciente' : 'Novo Paciente'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Nome Completo</label><input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">CPF</label><input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Senha</label><input className="input" type="password" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required={!editingPatient} placeholder={editingPatient ? "Vazio para manter" : ""} /></div>
                  <div className="form-group"><label className="label">Data Nasc.</label><input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Telefone</label><input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Sangue</label><select className="select" value={formData.tipoSang} onChange={e => setFormData({ ...formData, tipoSang: e.target.value })}>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- ABA MÉDICOS --- */
const DoctorsTab = () => {
  const [doctors, setDoctors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', uf: '', crm: '', especialidade: '', descricao: '',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchDoctors = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/medicos', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setDoctors(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleEdit = (d) => {
    setEditingDoctor(d);
    setFormData({ ...d, dataNasc: d.dataNasc ? d.dataNasc.split('T')[0] : '', senha: '', endereco: d.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Clinica:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData, telefone: Number(formData.telefone), crm: Number(formData.crm) };
    if (editingDoctor) {
      payload.id_medic = editingDoctor._id;
      if (authData?.role === 'admin') payload.id_admin = authData.id;
      else payload.id_recep = authData.id;
      await fetch('http://localhost:3001/medicos', { method: 'PUT', headers, body: JSON.stringify(payload) });
    } else {
      await fetch('http://localhost:3001/medicos', { method: 'POST', headers, body: JSON.stringify(payload) });
    }
    fetchDoctors(); setIsOpen(false); setEditingDoctor(null);
  };

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Médico</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>CRM</th><th>Especialidade</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{doctors.map(d => (<tr key={d._id}><td>{d.nome}</td><td>{d.crm}</td><td>{d.especialidade}</td><td><div className="table-actions"><button className="btn-ghost btn-icon" onClick={() => handleEdit(d)}><Pencil size={16} /></button><button className="btn-ghost btn-icon" onClick={async () => { if (window.confirm('Excluir?')) { const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token; await fetch('http://localhost:3001/medicos', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id: d._id }) }); fetchDoctors(); } }}><Trash2 size={16} /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingDoctor ? 'Editar Médico' : 'Novo Médico'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Nome</label><input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">CPF</label><input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Senha</label><input className="input" type="password" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required={!editingDoctor} /></div>
                  <div className="form-group"><label className="label">Data Nasc.</label><input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Telefone</label><input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">UF (Conselho)</label><input className="input" maxLength="2" value={formData.uf} onChange={e => setFormData({ ...formData, uf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">CRM</label><input className="input" value={formData.crm} onChange={e => setFormData({ ...formData, crm: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Especialidade</label><input className="input" value={formData.especialidade} onChange={e => setFormData({ ...formData, especialidade: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Descrição</label><input className="input" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} /></div>
                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- ABA ENFERMEIROS --- */
const NursesTab = () => {
  const [nurses, setNurses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', uf: '', coren: '',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchNurses = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/enfermeiros', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setNurses(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchNurses(); }, [fetchNurses]);

  const handleEdit = (n) => {
    setEditingNurse(n);
    setFormData({ ...n, dataNasc: n.dataNasc ? n.dataNasc.split('T')[0] : '', senha: '', endereco: n.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Clinica:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData, telefone: Number(formData.telefone), coren: Number(formData.coren) };
    if (editingNurse) {
      payload.id_enfer = editingNurse._id;
      if (authData?.role === 'admin') payload.id_admin = authData.id;
      else payload.id_recep = authData.id;
      await fetch('http://localhost:3001/enfermeiros', { method: 'PUT', headers, body: JSON.stringify(payload) });
    } else {
      await fetch('http://localhost:3001/enfermeiros', { method: 'POST', headers, body: JSON.stringify(payload) });
    }
    fetchNurses(); setIsOpen(false); setEditingNurse(null);
  };

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Enfermeiro</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>COREN</th><th>Telefone</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{nurses.map(n => (<tr key={n._id}><td>{n.nome}</td><td>{n.coren}</td><td>{n.telefone}</td><td><div className="table-actions"><button className="btn-ghost btn-icon" onClick={() => handleEdit(n)}><Pencil size={16} /></button><button className="btn-ghost btn-icon" onClick={async () => { if (window.confirm('Excluir?')) { const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token; await fetch('http://localhost:3001/enfermeiros', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id: n._id }) }); fetchNurses(); } }}><Trash2 size={16} /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingNurse ? 'Editar Enfermeiro' : 'Novo Enfermeiro'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Nome</label><input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">CPF</label><input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Senha</label><input className="input" type="password" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required={!editingNurse} /></div>
                  <div className="form-group"><label className="label">Data Nasc.</label><input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Telefone</label><input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">UF</label><input className="input" maxLength="2" value={formData.uf} onChange={e => setFormData({ ...formData, uf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">COREN</label><input className="input" value={formData.coren} onChange={e => setFormData({ ...formData, coren: e.target.value })} required /></div>
                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- ABA RECEPCIONISTAS --- */
const ReceptionistsTab = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', dataNasc: '', telefone: '', turno: 'Manhã',
    endereco: { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' }
  });

  const fetchReceptionists = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/recepcionistas', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setReceptionists(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchReceptionists(); }, [fetchReceptionists]);

  const handleEdit = (r) => {
    setEditingReceptionist(r);
    setFormData({ ...r, dataNasc: r.dataNasc ? r.dataNasc.split('T')[0] : '', senha: '', endereco: r.endereco || { estado: '', cidade: '', bairro: '', rua: '', cep: '', numero: '' } });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem('@Clinica:user'));
    const token = authData?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData };
    if (editingReceptionist) {
      payload.id_recep = editingReceptionist._id;
      if (authData?.role === 'admin') payload.id_admin = authData.id;
      else payload.id_recep_m = authData.id;
      await fetch('http://localhost:3001/recepcionistas', { method: 'PUT', headers, body: JSON.stringify(payload) });
    } else {
      await fetch('http://localhost:3001/recepcionistas', { method: 'POST', headers, body: JSON.stringify(payload) });
    }
    fetchReceptionists(); setIsOpen(false); setEditingReceptionist(null);
  };

  return (
    <div>
      <div className="actions-bar"><button className="btn btn-success" onClick={() => setIsOpen(true)}><Plus size={16} /> Adicionar Recepcionista</button></div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Nome</th><th>CPF</th><th>Turno</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>{receptionists.map(r => (<tr key={r._id}><td>{r.nome}</td><td>{r.cpf}</td><td>{r.turno}</td><td><div className="table-actions"><button className="btn-ghost btn-icon" onClick={() => handleEdit(r)}><Pencil size={16} /></button><button className="btn-ghost btn-icon" onClick={async () => { if (window.confirm('Excluir?')) { const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token; await fetch('http://localhost:3001/recepcionistas', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id: r._id }) }); fetchReceptionists(); } }}><Trash2 size={16} /></button></div></td></tr>))}</tbody>
        </table>
      </div>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingReceptionist ? 'Editar Recepcionista' : 'Novo Recepcionista'}</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label className="label">Nome</label><input className="input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">CPF</label><input className="input" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Senha</label><input className="input" type="password" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required={!editingReceptionist} /></div>
                  <div className="form-group"><label className="label">Data Nasc.</label><input className="input" type="date" value={formData.dataNasc} onChange={e => setFormData({ ...formData, dataNasc: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Telefone</label><input className="input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Turno</label><select className="select" value={formData.turno} onChange={e => setFormData({ ...formData, turno: e.target.value })}><option value="Manhã">Manhã</option><option value="Tarde">Tarde</option><option value="Noite">Noite</option></select></div>
                  <AddressForm endereco={formData.endereco} onChange={n => setFormData({ ...formData, endereco: n })} />
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};