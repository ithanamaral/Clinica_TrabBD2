import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Calendar, TrendingUp } from 'lucide-react';
import '../../styles/Dashboard.css';

export const ReceptionistDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem('@Clinica:user');
      const token = storedUser ? JSON.parse(storedUser).token : '';
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [patRes, docRes, aptRes] = await Promise.all([
          fetch('http://localhost:3001/pacientes', { headers }),
          fetch('http://localhost:3001/medicos', { headers }),
          fetch('http://localhost:3001/agendamento/recepcionista', { headers })
        ]);

        if (patRes.ok) setPatients(await patRes.json());
        if (docRes.ok) setDoctors(await docRes.json());
        if (aptRes.ok) setAppointments(await aptRes.json());
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.data === today);

  const stats = [
    {
      title: 'Total de Pacientes',
      value: patients.length,
      icon: Users,
      colorClass: 'primary',
    },
    {
      title: 'Médicos Disponíveis',
      value: doctors.length,
      icon: Stethoscope,
      colorClass: 'success',
    },
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.length,
      icon: Calendar,
      colorClass: 'primary',
    },

  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de gestão clínica</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="card-header stat-card-header">
                <h3 className="stat-card-title">{stat.title}</h3>
                <div className={`stat-icon ${stat.colorClass}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="card-content">
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Agendamentos de Hoje</h2>
          </div>
          <div className="card-content">
            <div className="appointments-list">
              {todayAppointments.length === 0 ? (
                <p className="empty-state">
                  Nenhum agendamento para hoje
                </p>
              ) : (
                todayAppointments.slice(0, 5).map((apt) => {
                  const patient = patients.find((p) => p._id === apt.id_paci);
                  const doctor = doctors.find((d) => d._id === apt.id_medic);
                  const isCompleted = apt.status === true || apt.status === "true";
                  return (
                    <div key={apt._id} className="appointment-item">
                      <div className="appointment-info">
                        <p style={{ fontWeight: '600', color: '#1e293b' }}>{patient?.nome || 'Paciente'}</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{doctor?.nome || 'Médico'}</p>
                      </div>
                      <div className="appointment-time">
                        <p>{apt.horario} às {apt.horarioFim}</p>
                        {/* Ajuste das cores e texto conforme o booleano real */}
                        <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`}>
                          {isCompleted ? 'Concluído' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Pacientes Recentes</h2>
          </div>
          <div className="card-content">
            <div className="appointments-list">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient._id} className="patient-item">
                  <div className="patient-avatar">
                    {patient?.nome?.charAt(0) || '?'}
                  </div>
                  <div className="patient-info">
                    <p>{patient?.nome || 'Nome indisponível'}</p>
                    <p>{patient?.cpf || 'CPF indisponível'}</p>
                  </div>
                  <div className="patient-blood">
                    <p>Tipo Sanguíneo</p>
                    <p>{patient.tipoSang}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
