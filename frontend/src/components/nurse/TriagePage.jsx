import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import '@/styles/Triage.css';

export const TriagePage = () => {
  const { appointments, patients, doctors, triages, addTriage } = useApp();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    appointmentId: '',
    bloodPressure: '',
    temperature: 0,
    weight: 0,
    height: 0,
    riskClassification: 'green',
    observations: '',
  });

  const appointmentsNeedingTriage = appointments.filter(
    (apt) => apt.status === 'pendente' && !apt.triageCompleted
  );

  const handleOpenTriage = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setFormData({
      appointmentId,
      bloodPressure: '',
      temperature: 0,
      weight: 0,
      height: 0,
      riskClassification: 'green',
      observations: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTriage(formData);
    alert('Triagem realizada com sucesso!');
    setSelectedAppointment(null);
  };

  const getRiskClass = (risk) => {
    const classes = {
      red: 'emergency',
      yellow: 'urgent',
      green: 'normal',
      blue: 'normal',
    };
    return classes[risk] || 'normal';
  };

  const getRiskLabel = (risk) => {
    const labels = {
      red: 'Emergência',
      yellow: 'Urgência',
      green: 'Pouco Urgente',
      blue: 'Não Urgente',
    };
    return labels[risk] || risk;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Triagem</h1>
        <p>Realize a triagem dos pacientes aguardando atendimento</p>
      </div>

      <div className="dashboard-stats">
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Aguardando Triagem</h3>
            <div className="stat-icon primary">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{appointmentsNeedingTriage.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Triagens Realizadas Hoje</h3>
            <div className="stat-icon success">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{triages.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Taxa de Conclusão</h3>
            <div className="stat-icon primary">
              <Activity size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">
              {appointments.length > 0
                ? Math.round((triages.length / appointments.length) * 100)
                : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Horário</th>
              <th>Data</th>
              <th>Status Triagem</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsNeedingTriage.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhum paciente aguardando triagem
                </td>
              </tr>
            ) : (
              appointmentsNeedingTriage.map((appointment) => {
                const patient = patients.find((p) => p.id === appointment.patientId);
                const doctor = doctors.find((d) => d.id === appointment.doctorId);
                const triage = triages.find((t) => t.appointmentId === appointment.id);

                return (
                  <tr key={appointment.id}>
                    <td>{patient?.name}</td>
                    <td>{doctor?.name}</td>
                    <td>{appointment.time}</td>
                    <td>{new Date(appointment.date).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className="badge badge-warning">Pendente</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenTriage(appointment.id)}
                        >
                          Realizar Triagem
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Triagem */}
      <div className={`modal-overlay ${selectedAppointment ? '' : 'hidden'}`} onClick={() => setSelectedAppointment(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Realizar Triagem</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="bloodPressure" className="label">Pressão Arterial</label>
                  <input
                    id="bloodPressure"
                    type="text"
                    className="input"
                    placeholder="Ex: 120/80"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="temperature" className="label">Temperatura (°C)</label>
                  <input
                    id="temperature"
                    type="number"
                    step="0.1"
                    className="input"
                    placeholder="Ex: 36.5"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight" className="label">Peso (kg)</label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="input"
                    placeholder="Ex: 70.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height" className="label">Altura (cm)</label>
                  <input
                    id="height"
                    type="number"
                    className="input"
                    placeholder="Ex: 175"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="riskClassification" className="label">Classificação de Risco</label>
                  <select
                    id="riskClassification"
                    className="select"
                    value={formData.riskClassification}
                    onChange={(e) => setFormData({ ...formData, riskClassification: e.target.value })}
                    required
                  >
                    <option value="red">Emergência (Vermelho)</option>
                    <option value="yellow">Urgência (Amarelo)</option>
                    <option value="green">Pouco Urgente (Verde)</option>
                    <option value="blue">Não Urgente (Azul)</option>
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="observations" className="label">Observações</label>
                  <textarea
                    id="observations"
                    className="textarea"
                    placeholder="Sintomas, queixas, observações gerais..."
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Salvar Triagem
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
