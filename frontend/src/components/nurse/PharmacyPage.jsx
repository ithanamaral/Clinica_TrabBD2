import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, Package, Minus } from 'lucide-react';
import '../../styles/Pharmacy.css';

export const PharmacyPage = () => {
  const [medications, setMedications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    activeIngredient: '',
    quantity: 0,
  });
  
  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [selectedMedForDispense, setSelectedMedForDispense] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dispenseData, setDispenseData] = useState({ patientId: '', quantity: 1 });

  const fetchMedications = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const res = await fetch('http://localhost:3001/medicamentos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMedications(await res.json());
      }
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const res = await fetch('http://localhost:3001/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPatients(await res.json());
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const lowStockMeds = medications.filter((med) => (med.qnt_disp || med.quantidade || med.quantity) <= 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const token = userObj?.token;

    if (!userObj || (!userObj.id && !userObj._id)) {
      alert("Sessão inválida ou expirada. Por favor, faça login novamente.");
      return;
    }

    const payload = {
      nome: formData.name,
      principio: formData.activeIngredient,
      qnt_disp: Number(formData.quantity),
      id_enfer: userObj?.id || userObj?._id
    };

    try {
      let res;
      if (editingMed) {
        res = await fetch('http://localhost:3001/medicamentos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ ...payload, id_medicam: editingMed._id || editingMed.id })
        });
      } else {
        res = await fetch('http://localhost:3001/medicamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(editingMed ? 'Medicamento atualizado!' : 'Medicamento cadastrado!');
        setIsOpen(false);
        resetForm();
        fetchMedications();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.erros ? err.erros.join(', ') : (err.erro || 'Erro ao salvar')}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      activeIngredient: '',
      quantity: 0,
    });
    setEditingMed(null);
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setFormData({
      name: med.nome || med.name,
      activeIngredient: med.principio || med.activeIngredient || '',
      quantity: med.qnt_disp || med.quantidade || med.quantity
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        await fetch('http://localhost:3001/medicamentos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ id })
        });
        alert('Medicamento excluído com sucesso!');
        fetchMedications();
      } catch (error) { console.error(error); }
    }
  };

  const handleDispenseClick = (med) => {
    setSelectedMedForDispense(med);
    setDispenseData({ patientId: '', quantity: 1 });
    setDispenseModalOpen(true);
    if (patients.length === 0) fetchPatients();
  };

  const handleDispenseSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const token = userObj?.token;

    if (!userObj || (!userObj.id && !userObj._id)) {
      alert("Sessão inválida. Faça login novamente.");
      return;
    }

    // Montar o payload para a rota de dispensas
    const payload = {
      id_medicam: selectedMedForDispense._id || selectedMedForDispense.id,
      id_paci: dispenseData.patientId,
      id_enfer: userObj.id || userObj._id,
      quantidade: Number(dispenseData.quantity)
    };

    console.log("🚀 Enviando para /dispensas:", payload); //Debug: verifique os dados
    try {
      // Enviar POST para /dispensas (O backend cuidará do estoque e do histórico)
      const res = await fetch('http://localhost:3001/dispensas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Medicamento dispensado e estoque atualizado!');
        setDispenseModalOpen(false);
        fetchMedications(); // Atualiza o estoque na tela
      } else {
        const err = await res.json();
        alert(`Erro: ${err.erro || 'Erro ao dispensar'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    }
  };

  return (
    <div>
      <div className="pharmacy-header">
        <div className="pharmacy-header-content">
          <h1>Farmácia</h1>
          <p>Gerencie o estoque de medicamentos</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsOpen(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Adicionar Medicamento
        </button>
      </div>

      {lowStockMeds.length > 0 && (
        <div className="stock-alert">
          <div className="stock-alert-title">
            <AlertTriangle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Alerta de Estoque Baixo
          </div>
          <p className="stock-alert-text">
            {lowStockMeds.length} medicamento(s) com estoque abaixo de 10 unidades
          </p>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Total de Medicamentos</h3>
            <div className="stat-icon primary">
              <Package size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{medications.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Estoque Baixo</h3>
            <div className="stat-icon success">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{lowStockMeds.length}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Quantidade</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medications.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  Nenhum medicamento cadastrado
                </td>
              </tr>
            ) : (
              medications.map((med) => (
                <tr key={med._id || med.id}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{med.nome || med.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{med.principio}</div>
                    {(med.qnt_disp || med.quantidade || med.quantity) <= 10 && (
                      <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>
                        Estoque Baixo
                      </span>
                    )}
                  </td>
                  <td>{med.qnt_disp || med.quantidade || med.quantity}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-ghost btn-icon"
                        onClick={() => handleDispenseClick(med)}
                        title="Dispensar para Paciente"
                      >
                        <Minus size={16} />
                      </button>
                      <button
                        className="btn-ghost btn-icon btn-edit"
                        onClick={() => handleEdit(med)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-ghost btn-icon btn-delete"
                        onClick={() => handleDelete(med._id || med.id)}
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
              {editingMed ? 'Editar Medicamento' : 'Novo Medicamento'}
            </h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="label">Nome do Medicamento</label>
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
                  <label htmlFor="activeIngredient" className="label">Princípio Ativo</label>
                  <input
                    id="activeIngredient"
                    type="text"
                    className="input"
                    value={formData.activeIngredient}
                    onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity" className="label">Quantidade</label>
                  <input
                    id="quantity"
                    type="number"
                    className="input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
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
                  {editingMed ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${dispenseModalOpen ? '' : 'hidden'}`} onClick={() => setDispenseModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Dispensar Medicamento</h2>
          </div>
          <div className="modal-body">
            <p className="mb-4">Medicamento: <strong>{selectedMedForDispense?.nome || selectedMedForDispense?.name}</strong></p>
            <p className="mb-4 text-sm text-gray-500">Disponível: {selectedMedForDispense?.qnt_disp || selectedMedForDispense?.quantidade || selectedMedForDispense?.quantity}</p>
            
            <form onSubmit={handleDispenseSubmit}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="patient" className="label">Paciente</label>
                  <select
                    id="patient"
                    className="select"
                    value={dispenseData.patientId}
                    onChange={(e) => setDispenseData({ ...dispenseData, patientId: e.target.value })}
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {patients.map(p => (
                      <option key={p._id || p.id} value={p._id || p.id}>{p.nome} - CPF: {p.cpf}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="dispenseQuantity" className="label">Quantidade</label>
                  <input
                    id="dispenseQuantity"
                    type="number"
                    className="input"
                    min="1"
                    max={selectedMedForDispense?.qnt_disp || selectedMedForDispense?.quantidade || selectedMedForDispense?.quantity}
                    value={dispenseData.quantity}
                    onChange={(e) => setDispenseData({ ...dispenseData, quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDispenseModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success">Confirmar Dispensa</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
