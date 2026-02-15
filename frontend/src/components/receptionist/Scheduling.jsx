import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '../../styles/Scheduling.css';

export const Scheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchData = async () => {
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [aptRes, patRes, docRes] = await Promise.all([
        fetch('http://localhost:3001/agendamento/recepcionista', { headers }),
        fetch('http://localhost:3001/pacientes', { headers }),
        fetch('http://localhost:3001/medicos', { headers })
      ]);

      if (aptRes.ok) setAppointments(await aptRes.json());
      if (patRes.ok) setPatients(await patRes.json());
      if (docRes.ok) setDoctors(await docRes.json());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_paci: '',
    id_medic: '',
    data: '',
    horario: '',
    descricao: '',
    status: true,
    triageCompleted: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';

    try {
      const response = await fetch("http://localhost:3001/agendamento/recepcionista", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Agendamento criado e salvo com sucesso!');
        setIsOpen(false);
        resetForm();
        fetchData();
      } else {
        const result = await response.json();
        const mensagemErro = result.erros ? result.erros.join(', ') : result.erro || 'Desconhecido';
        alert(`Erro ao salvar no banco de dados: ${mensagemErro}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setIsOpen(false);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setFormData({
      id_paci: '',
      id_medic: '',
      data: '',
      horario: '',
      descricao: '',
      status: true,
      triageCompleted: false,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      try {
        const response = await fetch("http://localhost:3001/agendamento/recepcionista", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (response.ok) {
          alert('Agendamento excluído com sucesso!');
          fetchData();
        }
      } catch (error) { console.error(error); }
    }
  };

  // Sort appointments by data and horario
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.data} ${a.horario}`);
    const dateB = new Date(`${b.data} ${b.horario}`);
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
                const patient = patients.find((p) => p._id === appointment.id_paci);
                const doctor = doctors.find((d) => d._id === appointment.id_medic);
                return (
                  <tr key={appointment._id}>
                    <td>{patient?.nome}</td>
                    <td>{doctor?.nome}</td>
                    <td>{appointment.data}</td>
                    <td>{appointment.horario}</td>
                    <td>
                      <span className={`status-badge ${appointment.status ? 'pending' : 'completed'}`}>
                        {appointment.status ? 'Pendente' : 'Concluído'}
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
                          onClick={() => handleDelete(appointment._id)}
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
                  <label htmlFor="id_paci" className="label">Paciente</label>
                  <select
                    id="id_paci"
                    className="select"
                    value={formData.id_paci}
                    onChange={(e) => setFormData({ ...formData, id_paci: e.target.value })}
                    required
                  >
                    <option value="">Selecione o paciente</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="id_medic" className="label">Médico</label>
                  <select
                    id="id_medic"
                    className="select"
                    value={formData.id_medic}
                    onChange={(e) => setFormData({ ...formData, id_medic: e.target.value })}
                    required
                  >
                    <option value="">Selecione o médico</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.nome} - {doctor.especialidade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="data" className="label">Data</label>
                  <input
                    id="data"
                    type="date"
                    className="input"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="horario" className="label">Horário</label>
                  <input
                    id="horario"
                    type="time"
                    className="input"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="descricao" className="label">Descrição</label>
                  <textarea
                    id="descricao"
                    className="textarea"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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