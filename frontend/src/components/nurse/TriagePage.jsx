import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../../styles/Triage.css';

export const TriagePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [triages, setTriages] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    bloodPressure: '',
    temperature: 0,
    weight: 0,
    height: 0,
    riskClassification: 'green',
    observations: '',
    id_enfer: '',
  });

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem('@Clinica:user');
      if (!storedUser) return;
      const token = JSON.parse(storedUser).token;
      const headers = { 'Authorization': `Bearer ${token}` };

      const resTriagens = await fetch('http://localhost:3001/triagem/enfermeiro', { headers });
      const dataTri = await resTriagens.json();
      setTriages(Array.isArray(dataTri) ? dataTri : []);

      const resAgendamentos = await fetch('http://localhost:3001/agendamento/enfermeiro', { headers }); 
      const dataAg = await resAgendamentos.json();
      setAppointments(Array.isArray(dataAg) ? dataAg : []);

      const [resPac, resMed, resEnf] = await Promise.all([
        fetch('http://localhost:3001/pacientes', { headers }),
        fetch('http://localhost:3001/medicos', { headers }),
        fetch('http://localhost:3001/enfermeiros', { headers })
      ]);
      
      if (resPac.ok) setPatients(await resPac.json());
      if (resMed.ok) setDoctors(await resMed.json());
      if (resEnf.ok) setNurses(await resEnf.json());

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingTriage = [];
  const completedTriage = [];

  appointments.forEach((apt) => {
    const aptId = String(apt._id || apt.id);
    
    const triageInfo = triages.find((t) => String(t.id_agen || t.id_agend || t.appointmentId || '') === aptId);

    if (triageInfo) {
      completedTriage.push({ ...apt, triageInfo });
    } else {
      pendingTriage.push(apt);
    }
  });

  const handleOpenTriage = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    
    const storedUser = localStorage.getItem('@Clinica:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const defaultNurse = userObj?.role === 'enfermeiro' ? (userObj.id || userObj._id) : '';

    setFormData({ 
      bloodPressure: '', 
      temperature: 36.5, 
      weight: 70, 
      height: 170, 
      riskClassification: 'green', 
      observations: '',
      id_enfer: defaultNurse
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('@Clinica:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;

    const agendamentoAtual = appointments.find(a => String(a._id || a.id) === String(selectedAppointment));
    const pacienteId = agendamentoAtual ? (agendamentoAtual.id_paci || agendamentoAtual.paciente_id) : null;

    if (!formData.id_enfer) {
      alert('Por favor, selecione o enfermeiro responsável.');
      return;
    }

    const payload = {
      id_agen: selectedAppointment,
      id_paci: pacienteId,
      id_enfer: formData.id_enfer,
      sinais_vitais: `PA: ${formData.bloodPressure}, Temp: ${formData.temperature}°C`, 
      altura: formData.height,
      peso: formData.weight,
      classificacao: formData.riskClassification,
      descricao: formData.observations
    };

    try {
      const response = await fetch('http://localhost:3001/triagem/enfermeiro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userObj.token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Triagem realizada com sucesso!');
        setSelectedAppointment(null);
        await fetchData(); // Atualiza a tela na hora
      } else {
        const err = await response.json();
        alert(`Erro: ${err.erros ? err.erros.join(', ') : err.erro}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatData = (dataStr) => {
    if (!dataStr) return '---';
    if (dataStr.includes('-')) {
      const [ano, mes, dia] = dataStr.split('T')[0].split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  if (loading) return <div className="p-4">Carregando painel de triagem...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Painel de Triagem</h1>
        <p>Gerenciamento de pacientes aguardando triagem e já avaliados</p>
      </div>

      <div className="dashboard-stats" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Aguardando Triagem</h3>
          </div>
          <div className="card-content">
            <div className="stat-value">{pendingTriage.length}</div>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Triagens Finalizadas</h3>
          </div>
          <div className="card-content">
            <div className="stat-value">{completedTriage.length}</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', color: '#ca8a04', marginBottom: '1rem' }}>🟡 Aguardando Triagem</h2>
      <div className="table-container" style={{ marginBottom: '2rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Horário</th>
              <th>Data</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingTriage.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">Nenhum paciente pendente</td></tr>
            ) : (
              pendingTriage.map((apt) => {
                const aptId = String(apt._id || apt.id);
                const patient = patients.find((p) => String(p._id || p.id) === String(apt.id_paci || apt.paciente_id));
                const doctor = doctors.find((d) => String(d._id || d.id) === String(apt.id_medic || apt.medico_id));

                return (
                  <tr key={aptId}>
                    <td>{patient?.nome || '---'}</td>
                    <td>{doctor?.nome || '---'}</td>
                    <td>{apt.horario || '---'}</td>
                    <td>{formatData(apt.data)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleOpenTriage(aptId)}>
                        Realizar Triagem
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {completedTriage.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.2rem', color: '#16a34a', marginBottom: '1rem' }}>✔️ Triagens Finalizadas</h2>
          <div className="table-container opacity-75">
            <table className="table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Horário</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {completedTriage.map((apt) => {
                  const aptId = String(apt._id || apt.id);
                  const patient = patients.find((p) => String(p._id || p.id) === String(apt.id_paci || apt.paciente_id));
                  const doctor = doctors.find((d) => String(d._id || d.id) === String(apt.id_medic || apt.medico_id));

                  return (
                    <tr key={aptId}>
                      <td>{patient?.nome || '---'}</td>
                      <td>{doctor?.nome || '---'}</td>
                      <td>{apt.horario || '---'}</td>
                      <td><span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>Pronto para Consulta</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Realizar Triagem</h2></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="label">Enfermeiro Responsável</label>
                  <select 
                    className="select"
                    value={formData.id_enfer}
                    onChange={(e) => setFormData({...formData, id_enfer: e.target.value})}
                    required
                  >
                    <option value="">Selecione o enfermeiro...</option>
                    {nurses.map(nurse => (
                      <option key={nurse._id || nurse.id} value={nurse._id || nurse.id}>
                        {nurse.nome}
                      </option>
                    ))}
                  </select>
                  {JSON.parse(localStorage.getItem('@Clinica:user'))?.role === 'admin' && (
                    <small style={{ color: '#666' }}>Selecione o enfermeiro que realizou o procedimento.</small>
                  )}
                  </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="label">Pressão Arterial</label>
                    <input type="text" className="input" placeholder="120/80" value={formData.bloodPressure} onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Temperatura (°C)</label>
                    <input type="number" step="0.1" className="input" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Peso (kg)</label>
                    <input type="number" step="0.1" className="input" value={formData.weight} onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Altura (cm)</label>
                    <input type="number" className="input" value={formData.height} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Classificação</label>
                    <select className="select" value={formData.riskClassification} onChange={(e) => setFormData({...formData, riskClassification: e.target.value})} required>
                      <option value="red">Emergência</option>
                      <option value="yellow">Urgência</option>
                      <option value="green">Pouco Urgente</option>
                      <option value="blue">Não Urgente</option>
                    </select>
                  </div>
                  <div className="form-group form-group-full">
                    <label className="label">Observações</label>
                    <textarea className="textarea" value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedAppointment(null)}>Cancelar</button>
                  <button type="submit" className="btn btn-success">Salvar Triagem</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};