import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Plus, Pencil, Trash2, AlertTriangle, Package } from 'lucide-react';
import '@/styles/Pharmacy.css';

export const PharmacyPage = () => {
  const { medications, addMedication, updateMedication, deleteMedication } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: 'unidade',
    expiryDate: '',
    manufacturer: '',
    description: '',
  });

  const lowStockMeds = medications.filter((med) => med.quantity <= 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMed) {
      updateMedication(editingMed.id, formData);
      alert('Medicamento atualizado com sucesso!');
    } else {
      addMedication(formData);
      alert('Medicamento cadastrado com sucesso!');
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 0,
      unit: 'unidade',
      expiryDate: '',
      manufacturer: '',
      description: '',
    });
    setEditingMed(null);
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setFormData(med);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      deleteMedication(id);
      alert('Medicamento excluído com sucesso!');
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
              <th>Unidade</th>
              <th>Validade</th>
              <th>Fabricante</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medications.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhum medicamento cadastrado
                </td>
              </tr>
            ) : (
              medications.map((med) => (
                <tr key={med.id}>
                  <td>
                    {med.name}
                    {med.quantity <= 10 && (
                      <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>
                        Estoque Baixo
                      </span>
                    )}
                  </td>
                  <td>{med.quantity}</td>
                  <td>{med.unit}</td>
                  <td>{new Date(med.expiryDate).toLocaleDateString('pt-BR')}</td>
                  <td>{med.manufacturer}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-ghost btn-icon btn-edit"
                        onClick={() => handleEdit(med)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-ghost btn-icon btn-delete"
                        onClick={() => handleDelete(med.id)}
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
                <div className="form-group">
                  <label htmlFor="unit" className="label">Unidade</label>
                  <select
                    id="unit"
                    className="select"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  >
                    <option value="unidade">Unidade</option>
                    <option value="caixa">Caixa</option>
                    <option value="frasco">Frasco</option>
                    <option value="ampola">Ampola</option>
                    <option value="comprimido">Comprimido</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="expiryDate" className="label">Data de Validade</label>
                  <input
                    id="expiryDate"
                    type="date"
                    className="input"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="manufacturer" className="label">Fabricante</label>
                  <input
                    id="manufacturer"
                    type="text"
                    className="input"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="description" className="label">Descrição</label>
                  <textarea
                    id="description"
                    className="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
    </div>
  );
};
