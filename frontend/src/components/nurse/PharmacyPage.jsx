import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, Package, Minus } from 'lucide-react';
import '../../styles/Pharmacy.css';

export const PharmacyPage = () => {
  const [medications, setMedications] = useState([]);
  const [nurses, setNurses] = useState([]); //
  const [isOpen, setIsOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    activeIngredient: '',
    quantity: 0,
    id_enfer: '' //
  });
  
  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [selectedMedForDispense, setSelectedMedForDispense] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dispenseData, setDispenseData] = useState({ patientId: '', quantity: 1, id_enfer: '' }); //

  const fetchMedications = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/medicamentos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setMedications(await res.json());
    } catch (error) { console.error("Erro ao buscar medicamentos:", error); }
  };

  const fetchPatients = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPatients(await res.json());
    } catch (error) { console.error("Erro ao buscar pacientes:", error); }
  };

  // Função para buscar enfermeiros
  const fetchNurses = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
      const res = await fetch('http://localhost:3001/enfermeiros', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setNurses(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchMedications();
    fetchNurses(); //
  }, [fetchNurses]);

  const lowStockMeds = medications.filter((med) => (med.qnt_disp || med.quantidade || med.quantity) <= 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userObj = JSON.parse(localStorage.getItem('@Clinica:user'));
    
    // Define qual ID de enfermeiro usar: o selecionado (admin) ou o do próprio usuário logado
    const enfermeiroId = userObj?.role === 'admin' ? formData.id_enfer : (userObj?.id || userObj?._id);

    if (!enfermeiroId) return alert("Selecione o enfermeiro responsável.");

    const payload = {
      nome: formData.name,
      principio: formData.activeIngredient,
      qnt_disp: Number(formData.quantity),
      id_enfer: enfermeiroId
    };

    try {
      const method = editingMed ? 'PUT' : 'POST';
      const body = editingMed ? { ...payload, id_medicam: editingMed._id } : payload;
      
      const res = await fetch('http://localhost:3001/medicamentos', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userObj.token}` },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(editingMed ? 'Atualizado!' : 'Cadastrado!');
        setIsOpen(false);
        resetForm();
        fetchMedications();
      }
    } catch (error) { console.error(error); }
  };

  const handleDispenseSubmit = async (e) => {
    e.preventDefault();
    const userObj = JSON.parse(localStorage.getItem('@Clinica:user'));
    
    const enfermeiroId = userObj?.role === 'admin' ? dispenseData.id_enfer : (userObj?.id || userObj?._id);

    if (!enfermeiroId) return alert("Selecione o enfermeiro que está realizando a dispensa.");

    const payload = {
      id_medicam: selectedMedForDispense._id,
      id_paci: dispenseData.patientId,
      id_enfer: enfermeiroId,
      quantidade: Number(dispenseData.quantity)
    };

    try {
      const res = await fetch('http://localhost:3001/dispensas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userObj.token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Dispensado com sucesso!');
        setDispenseModalOpen(false);
        fetchMedications();
      }
    } catch (error) { console.error(error); }
  };

  const resetForm = () => {
    setFormData({ name: '', activeIngredient: '', quantity: 0, id_enfer: '' });
    setEditingMed(null);
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setFormData({
      name: med.nome,
      activeIngredient: med.principio,
      quantity: med.qnt_disp,
      id_enfer: med.id_enfer || ''
    });
    setIsOpen(true);
  };

  const handleDispenseClick = (med) => {
    setSelectedMedForDispense(med);
    setDispenseData({ patientId: '', quantity: 1, id_enfer: '' });
    setDispenseModalOpen(true);
    if (patients.length === 0) fetchPatients();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir?')) return;
    const token = JSON.parse(localStorage.getItem('@Clinica:user'))?.token;
    await fetch('http://localhost:3001/medicamentos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    fetchMedications();
  };

  return (
    <div>
      <div className="pharmacy-header">
        <div className="pharmacy-header-content">
          <h1>Farmácia</h1>
          <p>Gerencie o estoque de medicamentos</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Adicionar Medicamento
        </button>
      </div>

      {lowStockMeds.length > 0 && (
        <div className="stock-alert">
          <div className="stock-alert-title"><AlertTriangle size={20} /> Alerta de Estoque Baixo</div>
          <p>{lowStockMeds.length} item(s) com estoque crítico.</p>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Total</h3>
            <div className="stat-icon primary"><Package size={16} /></div>
          </div>
          <div className="card-content"><div className="stat-value">{medications.length}</div></div>
        </div>
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Crítico</h3>
            <div className="stat-icon success"><AlertTriangle size={16} /></div>
          </div>
          <div className="card-content"><div className="stat-value">{lowStockMeds.length}</div></div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>Medicamento</th><th>Quantidade</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>
            {medications.map((med) => (
              <tr key={med._id}>
                <td>
                  <div style={{ fontWeight: '500' }}>{med.nome}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{med.principio}</div>
                  {med.qnt_disp <= 10 && <span className="badge badge-danger">Baixo</span>}
                </td>
                <td>{med.qnt_disp}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-ghost btn-icon" onClick={() => handleDispenseClick(med)} title="Dispensar"><Minus size={16} /></button>
                    <button className="btn-ghost btn-icon btn-edit" onClick={() => handleEdit(med)}><Pencil size={16} /></button>
                    <button className="btn-ghost btn-icon btn-delete" onClick={() => handleDelete(med._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Cadastro/Edição */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => { setIsOpen(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">{editingMed ? 'Editar' : 'Novo'} Medicamento</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Seletor para Admin no Cadastro */}
                  {JSON.parse(localStorage.getItem('@Clinica:user'))?.role === 'admin' && (
                    <div className="form-group form-group-full">
                      <label className="label">Enfermeiro Responsável pelo Estoque</label>
                      <select className="select" value={formData.id_enfer} onChange={e => setFormData({ ...formData, id_enfer: e.target.value })} required>
                        <option value="">Selecione...</option>
                        {nurses.map(n => <option key={n._id} value={n._id}>{n.nome}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="form-group"><label className="label">Nome</label><input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Princípio Ativo</label><input className="input" value={formData.activeIngredient} onChange={e => setFormData({ ...formData, activeIngredient: e.target.value })} required /></div>
                  <div className="form-group"><label className="label">Quantidade</label><input type="number" className="input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} required /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => { setIsOpen(false); resetForm(); }}>Cancelar</button><button type="submit" className="btn btn-success">Salvar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dispensa */}
      {dispenseModalOpen && (
        <div className="modal-overlay" onClick={() => setDispenseModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Dispensar Medicamento</h2></div>
            <div className="modal-body">
              <form onSubmit={handleDispenseSubmit}>
                <div className="form-grid">
                  {/* Seletor para Admin na Dispensa */}
                  {JSON.parse(localStorage.getItem('@Clinica:user'))?.role === 'admin' && (
                    <div className="form-group form-group-full">
                      <label className="label">Enfermeiro Realizando a Dispensa</label>
                      <select className="select" value={dispenseData.id_enfer} onChange={e => setDispenseData({ ...dispenseData, id_enfer: e.target.value })} required>
                        <option value="">Selecione...</option>
                        {nurses.map(n => <option key={n._id} value={n._id}>{n.nome}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="form-group form-group-full"><label className="label">Paciente</label><select className="select" value={dispenseData.patientId} onChange={e => setDispenseData({ ...dispenseData, patientId: e.target.value })} required><option value="">Selecione...</option>{patients.map(p => (<option key={p._id} value={p._id}>{p.nome} - {p.cpf}</option>))}</select></div>
                  <div className="form-group"><label className="label">Quantidade</label><input type="number" className="input" min="1" max={selectedMedForDispense?.qnt_disp} value={dispenseData.quantity} onChange={e => setDispenseData({ ...dispenseData, quantity: parseInt(e.target.value) })} required /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setDispenseModalOpen(false)}>Cancelar</button><button type="submit" className="btn btn-success">Confirmar</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};