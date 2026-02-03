import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Users, Clock, AlertCircle } from 'lucide-react';
import '@/styles/DoctorQueue.css';

export const DoctorQueue = ({ onStartConsultation }) => {
  const { appointments, patients, triages, currentUser } = useApp();

  // Get appointments for current doctor
  const myAppointments = appointments.filter(
    (apt) => apt.doctorId === currentUser?.id && apt.status === 'pendente'
  );

  // Sort by triage priority and time
  const sortedAppointments = [...myAppointments].sort((a, b) => {
    const triageA = triages.find((t) => t.appointmentId === a.id);
    const triageB = triages.find((t) => t.appointmentId === b.id);

    const priorityOrder = { red: 0, yellow: 1, green: 2, blue: 3 };
    const priorityA = triageA ? priorityOrder[triageA.riskClassification] : 4;
    const priorityB = triageB ? priorityOrder[triageB.riskClassification] : 4;

    if (priorityA !== priorityB) return priorityA - priorityB;

    const timeA = new Date(`${a.date} ${a.time}`);
    const timeB = new Date(`${b.date} ${b.time}`);
    return timeA.getTime() - timeB.getTime();
  });

  const appointmentsWithTriage = sortedAppointments.filter(
    (apt) => apt.triageCompleted
  );

  return (
    <div>
      <div className="queue-header">
        <h1>Fila de Atendimento</h1>
        <p>Pacientes aguardando consulta</p>
      </div>

      <div className="dashboard-stats">
        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Total na Fila</h3>
            <div className="stat-icon primary">
              <Users size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{myAppointments.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Aguardando Triagem</h3>
            <div className="stat-icon success">
              <Clock size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">
              {myAppointments.filter((apt) => !apt.triageCompleted).length}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header stat-card-header">
            <h3 className="stat-card-title">Prontos para Atendimento</h3>
            <div className="stat-icon success">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{appointmentsWithTriage.length}</div>
          </div>
        </div>
      </div>

      <div className="grid">
        {appointmentsWithTriage.length === 0 ? (
          <div className="card">
            <div className="card-content">
              <p className="empty-state">Nenhum paciente na fila de atendimento</p>
            </div>
          </div>
        ) : (
          appointmentsWithTriage.map((appointment) => {
            const patient = patients.find((p) => p.id === appointment.patientId);
            const triage = triages.find((t) => t.appointmentId === appointment.id);

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
              <div key={appointment.id} className="patient-queue-item">
                <div className="patient-queue-header">
                  <div className="patient-queue-info">
                    <h3>{patient?.name}</h3>
                    <p>CPF: {patient?.cpf}</p>
                  </div>
                  {triage && (
                    <span className={`priority-badge ${getRiskClass(triage.riskClassification)}`}>
                      {getRiskLabel(triage.riskClassification)}
                    </span>
                  )}
                </div>

                <div className="patient-queue-details">
                  <div className="patient-queue-detail">
                    <strong>Horário:</strong>
                    <span>{appointment.time}</span>
                  </div>
                  <div className="patient-queue-detail">
                    <strong>Data:</strong>
                    <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {triage && (
                    <>
                      <div className="patient-queue-detail">
                        <strong>Pressão:</strong>
                        <span>{triage.bloodPressure}</span>
                      </div>
                      <div className="patient-queue-detail">
                        <strong>Temperatura:</strong>
                        <span>{triage.temperature}°C</span>
                      </div>
                      <div className="patient-queue-detail">
                        <strong>Peso:</strong>
                        <span>{triage.weight} kg</span>
                      </div>
                      <div className="patient-queue-detail">
                        <strong>Altura:</strong>
                        <span>{triage.height} cm</span>
                      </div>
                    </>
                  )}
                </div>

                {triage && triage.observations && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
                      Observações da Triagem:
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {triage.observations}
                    </p>
                  </div>
                )}

                <div className="patient-queue-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => onStartConsultation(appointment.id)}
                  >
                    Iniciar Consulta
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
