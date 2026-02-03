import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Users, Stethoscope, Calendar, TrendingUp } from 'lucide-react';
import '@/styles/Dashboard.css';

export const ReceptionistDashboard = () => {
  const { patients, doctors, appointments } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today);

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
    {
      title: 'Taxa de Ocupação',
      value: '85%',
      icon: TrendingUp,
      colorClass: 'success',
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
                  const patient = patients.find((p) => p.id === apt.patientId);
                  const doctor = doctors.find((d) => d.id === apt.doctorId);
                  return (
                    <div key={apt.id} className="appointment-item">
                      <div className="appointment-info">
                        <p>{patient?.name}</p>
                        <p>Dr(a). {doctor?.name}</p>
                      </div>
                      <div className="appointment-time">
                        <p>{apt.time}</p>
                        <span className={`badge ${apt.status === 'pendente' ? 'badge-primary' : 'badge-success'}`}>
                          {apt.status === 'pendente' ? 'Pendente' : 'Concluído'}
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
                <div key={patient.id} className="patient-item">
                  <div className="patient-avatar">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="patient-info">
                    <p>{patient.name}</p>
                    <p>{patient.cpf}</p>
                  </div>
                  <div className="patient-blood">
                    <p>Tipo Sanguíneo</p>
                    <p>{patient.bloodType}</p>
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
