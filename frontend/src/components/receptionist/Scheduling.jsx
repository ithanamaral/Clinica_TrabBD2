import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Calendar } from 'lucide-react';
import '../../styles/Scheduling.css';

export const Scheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);

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
    horarioFim: '',
    descricao: '',
    status: true,
    triageCompleted: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trava de horários (Mantida)
    const agora = new Date();
    // Usamos uma data base fictícia para comparar apenas os horários se for no mesmo dia
    const dataBaseStr = formData.data.includes('/') ? formData.data.split('/').reverse().join('-') : formData.data;
    const dataInicio = new Date(`${dataBaseStr}T${formData.horario}`);
    const dataFim = new Date(`${dataBaseStr}T${formData.horarioFim}`);

    // Só bloqueia passado se for um agendamento NOVO ou se mudou a data/hora para o passado
    if (!editingAppointment && dataInicio < agora) {
       alert("⚠️ Não é possível agendar para um horário que já passou.");
       return; 
    }

    if (dataFim <= dataInicio) {
      alert("⚠️ O horário de saída deve ser depois do horário de entrada!");
      return;
    }

    const storedUser = localStorage.getItem('@Clinica:user');
    const token = storedUser ? JSON.parse(storedUser).token : '';
    const headers = { "Content-Type": "application/json" , "Authorization": `Bearer ${token}` };

    try {
      let response;
      // SE ESTIVER EDITANDO (PUT)
      if (editingAppointment) {
        response = await fetch("http://localhost:3001/agendamento/recepcionista", {
          method: "PUT",
          headers,
          // O backend espera 'id_agend' para atualizar
          body: JSON.stringify({ ...formData, id_agend: editingAppointment._id }),
        });
      } 
      // SE FOR NOVO (POST)
      else {
        response = await fetch("http://localhost:3001/agendamento/recepcionista", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        alert(editingAppointment ? 'Agendamento atualizado!' : 'Agendamento criado!');
        setIsOpen(false);
        resetForm();
        fetchData();
      } else {
        const result = await response.json();
        const mensagemErro = result.erros ? result.erros.join(', ') : result.erro || 'Desconhecido';
        alert(`Erro: ${mensagemErro}`);
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
      horarioFim: '',
      descricao: '',
      status: true,
      triageCompleted: false,
    });
    setEditingAppointment(null);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    // Preenche o formulário com os dados do agendamento clicado
    setFormData({
      id_paci: appointment.id_paci,
      id_medic: appointment.id_medic,
      data: appointment.data,
      horario: appointment.horario,
      horarioFim: appointment.horarioFim,
      descricao: appointment.descricao,
      status: appointment.status,
      triageCompleted: appointment.triageCompleted
    });
    setIsOpen(true);
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

  const formatarDataBR = (dataString) => {
    if (!dataString) return '';
    if (dataString.includes('/')) return dataString; 
    
    if (dataString.includes('-')) {
      const [ano, mes, dia] = dataString.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return dataString;
  };

  // --- NOVA LÓGICA DE FILTRAGEM E AGRUPAMENTO ---

  // Data de hoje no formato YYYY-MM-DD para comparação
  const today = new Date().toISOString().split('T')[0];

  // 1. Filtrar (Nome, Médico e REGRA DE DATA)
  const filteredAppointments = appointments.filter((apt) => {
    const patient = patients.find((p) => p._id === apt.id_paci);
    const doctor = doctors.find((d) => d._id === apt.id_medic);

    // Filtros de texto
    const matchPatient = patient?.nome?.toLowerCase().includes(filterPatient.toLowerCase()) ?? false;
    const matchDoctor = doctor?.nome?.toLowerCase().includes(filterDoctor.toLowerCase()) ?? false;

    // Regra de Data:
    // Se tiver data no filtro, usa ela exata.
    // Se NÃO tiver filtro, mostra de hoje para frente.
    let matchDate = false;
    if (filterDate) {
      matchDate = apt.data === filterDate;
    } else {
      matchDate = apt.data >= today;
    }

    return matchPatient && matchDoctor && matchDate;
  });

  // 2. Ordenar (Mantendo a correção do fuso)
  const sortedFiltered = [...filteredAppointments].sort((a, b) => {
    const formatToUS = (d) => d.includes('/') ? d.split('/').reverse().join('-') : d;
    const dateA = new Date(`${formatToUS(a.data)}T${a.horario}`);
    const dateB = new Date(`${formatToUS(b.data)}T${b.horario}`);
    // Ordenação decrescente (mais novos primeiro)
    return dateB.getTime() - dateA.getTime();
  });

  // 3. Agrupar por Data Formatada (BR)
  const groupedAppointments = sortedFiltered.reduce((groups, apt) => {
    const dateKey = formatarDataBR(apt.data);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(apt);
    return groups;
  }, {});
  // -----------------------------------------------

  // Sort appointments by data and horario
  //const sortedAppointments = [...appointments].sort((a, b) => {
  //  const dateA = new Date(`${a.data} ${a.horario}`);
  //  const dateB = new Date(`${b.data} ${b.horario}`);
  //  return dateB.getTime() - dateA.getTime();
  //});

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

      {/* BARRA DE FILTROS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          className="input"
          placeholder="🔍 Filtrar por Paciente..."
          value={filterPatient}
          onChange={(e) => setFilterPatient(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <input
          type="text"
          className="input"
          placeholder="🩺 Filtrar por Médico..."
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        {/* NOVO FILTRO DE DATA */}
        <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}/>
            <input
            type="date"
            className="input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ paddingLeft: '35px', maxWidth: '180px' }}
            title="Filtrar por data específica (limpe para ver agendamentos futuros)"
            />
        </div>
        {/* Botão para limpar filtro de data se ele estiver preenchido */}
        {filterDate && (
            <button className="btn-ghost" onClick={() => setFilterDate('')} style={{fontSize: '0.9rem'}}>
                Limpar Data
            </button>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              {/* Coluna 'Data' removida daqui */}
              <th>Horário</th>
              <th>Status</th>
              <th>Triagem</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedAppointments).length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhum agendamento encontrado
                </td>
              </tr>
            ) : (
              Object.keys(groupedAppointments).map((date) => (
                <React.Fragment key={date}>
                  {/* LINHA DE CABEÇALHO DO GRUPO (DATA) */}
                  <tr style={{ backgroundColor: '#f0fdf4', borderBottom: '2px solid #c6f6d5' }}>
                    <td colSpan="6" style={{ fontWeight: 'bold', color: '#166534', padding: '0.75rem 1rem' }}>
                      📅 {date}
                    </td>
                  </tr>
                  
                  {/* AGENDAMENTOS DESTA DATA */}
                  {groupedAppointments[date].map((appointment) => {
                    const patient = patients.find((p) => p._id === appointment.id_paci);
                    const doctor = doctors.find((d) => d._id === appointment.id_medic);
                    return (
                      <tr key={appointment._id}>
                        <td>{patient?.nome}</td>
                        <td>{doctor?.nome}</td>
                        {/* Coluna 'Data' removida daqui também */}
                        <td>{appointment.horario} às {appointment.horarioFim}</td>
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
                            className="btn-ghost btn-icon btn-edit"
                            onClick={() => handleEdit(appointment)}
                            title="Editar"
                            >
                            <Pencil size={16} />
                            </button>
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
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${isOpen ? '' : 'hidden'}`} onClick={() => { setIsOpen(false); resetForm(); }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
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
                    min={new Date().toISOString().split('T')[0]} // <-- ESSA LINHA TRAVA O CALENDÁRIO
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="horario" className="label">Horário de Chegada</label>
                  <input id="horario" type="time" className="input" value={formData.horario} onChange={(e) => setFormData({ ...formData, horario: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="horarioFim" className="label">Horário de Saída</label>
                  <input id="horarioFim" type="time" className="input" value={formData.horarioFim} onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })} required />
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
                  {editingAppointment ? 'Atualizar' : 'Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};