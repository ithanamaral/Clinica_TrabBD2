import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Plus, Trash2 } from 'lucide-react';
import '../../styles/Scheduling.css';

export const Scheduling = () => {
  const { appointments, patients, doctors, addAppointment, deleteAppointment } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    description: '',
    status: 'pendente',
    triageCompleted: false,
  });

const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // Aqui você pode manter a lógica local se quiser que apareça na tela na hora
    addAppointment(formData);

    try {
      const response = await fetch("http://localhost:3001/agendamento/recepcionista", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          "Authorization": `${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Agendamento criado e salvo com sucesso!');
        setIsOpen(false);
        resetForm();
      } else {
        alert('Erro ao salvar no banco de dados.');
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      // Mesmo com erro no banco, limpamos o modal para o usuário não travar
      setIsOpen(false);
      resetForm();
    }
  };
  


  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      description: '',
      status: 'pendente',
      triageCompleted: false,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      deleteAppointment(id);
      alert('Agendamento excluído com sucesso!');
    }
  };

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div>
      <div className="scheduling-header">
        <div className="scheduling-header-content">
          <h1>Agendamentos</h1>
          <p>Gerencie os agendamentos de consultas</p>
        </div>
        <button
          className="btn btn-success"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Novo Agendamento
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Triagem</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Nenhum agendamento cadastrado
                </td>
              </tr>
            ) : (
              sortedAppointments.map((appointment) => {
                const patient = patients.find((p) => p.id === appointment.patientId);
                const doctor = doctors.find((d) => d.id === appointment.doctorId);
                return (
                  <tr key={appointment.id}>
                    <td>{patient?.name}</td>
                    <td>{doctor?.name}</td>
                    <td>
                      {new Date(appointment.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status-badge ${appointment.status === 'pendente' ? 'pending' : 'completed'}`}>
                        {appointment.status === 'pendente' ? 'Pendente' : 'Concluído'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${appointment.triageCompleted ? 'completed' : 'pending'}`}>
                        {appointment.triageCompleted ? 'Concluída' : 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-ghost btn-icon btn-delete"
                          onClick={() => handleDelete(appointment.id)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Novo Agendamento</h2>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="patientId" className="label">Paciente</label>
                  <select
                    id="patientId"
                    className="select"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    required
                  >
                    <option value="">Selecione o paciente</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="doctorId" className="label">Médico</label>
                  <select
                    id="doctorId"
                    className="select"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    required
                  >
                    <option value="">Selecione o médico</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date" className="label">Data</label>
                  <input
                    id="date"
                    type="date"
                    className="input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time" className="label">Horário</label>
                  <input
                    id="time"
                    type="time"
                    className="input"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                    placeholder="Ex: Consulta de rotina, checkup anual..."
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
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};


