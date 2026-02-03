import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import '@/styles/Consultation.css';

export const ConsultationPage = ({ appointmentId, onBack }) => {
  const { appointments, patients, triages, addPrescription, addExamRequest, completeAppointment } = useApp();
  
  const appointment = appointments.find((apt) => apt.id === appointmentId);
  const patient = patients.find((p) => p.id === appointment?.patientId);
  const triage = triages.find((t) => t.appointmentId === appointmentId);

  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [exams, setExams] = useState([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);

  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const [examForm, setExamForm] = useState({
    examType: '',
    reason: '',
  });

  const handleAddPrescription = (e) => {
    e.preventDefault();
    setPrescriptions([...prescriptions, { ...prescriptionForm, id: Date.now() }]);
    setPrescriptionForm({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    });
    setShowPrescriptionForm(false);
  };

  const handleRemovePrescription = (id) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    setExams([...exams, { ...examForm, id: Date.now() }]);
    setExamForm({ examType: '', reason: '' });
    setShowExamForm(false);
  };

  const handleRemoveExam = (id) => {
    setExams(exams.filter((e) => e.id !== id));
  };

  const handleCompleteConsultation = () => {
    if (!diagnosis || !treatmentPlan) {
      alert('Por favor, preencha o diagnóstico e plano de tratamento');
      return;
    }

    // Save prescriptions
    prescriptions.forEach((prescription) => {
      addPrescription({ appointmentId, patientId: patient.id, ...prescription });
    });

    // Save exam requests
    exams.forEach((exam) => {
      addExamRequest({ appointmentId, patientId: patient.id, ...exam });
    });

    // Complete appointment
    completeAppointment(appointmentId, { diagnosis, treatmentPlan });

    alert('Consulta finalizada com sucesso!');
    onBack();
  };

  if (!appointment || !patient) {
    return (
      <div className="card">
        <div className="card-content">
          <p className="empty-state">Consulta não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <div className="consultation-header-content">
          <h1>Consulta - {patient.name}</h1>
          <p>CPF: {patient.cpf} | Tipo Sanguíneo: {patient.bloodType}</p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Voltar
        </button>
      </div>

      <div className="consultation-grid">
        <div>
          {/* Diagnóstico */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">Diagnóstico</h2>
            </div>
            <div className="card-content">
              <textarea
                className="textarea"
                placeholder="Descreva o diagnóstico do paciente..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows="4"
              />
            </div>
          </div>

          {/* Plano de Tratamento */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">Plano de Tratamento</h2>
            </div>
            <div className="card-content">
              <textarea
                className="textarea"
                placeholder="Descreva o plano de tratamento..."
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                rows="4"
              />
            </div>
          </div>

          {/* Prescrições */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="section-header">
                <h2 className="card-title">Prescrições</h2>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                >
                  <Plus size={16} style={{ marginRight: '0.25rem' }} />
                  Adicionar
                </button>
              </div>
            </div>
            <div className="card-content">
              {showPrescriptionForm && (
                <form onSubmit={handleAddPrescription} className="mb-4" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="label">Medicamento</label>
                      <input
                        type="text"
                        className="input"
                        value={prescriptionForm.medication}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Dosagem</label>
                      <input
                        type="text"
                        className="input"
                        value={prescriptionForm.dosage}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Frequência</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Ex: 8 em 8 horas"
                        value={prescriptionForm.frequency}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Duração</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Ex: 7 dias"
                        value={prescriptionForm.duration}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group form-group-full">
                      <label className="label">Instruções</label>
                      <textarea
                        className="textarea"
                        value={prescriptionForm.instructions}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-success btn-sm">Adicionar</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPrescriptionForm(false)}>Cancelar</button>
                  </div>
                </form>
              )}

              {prescriptions.length === 0 ? (
                <p className="empty-state" style={{ padding: '1rem' }}>Nenhuma prescrição adicionada</p>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription.id} className="prescription-item">
                    <h4>{prescription.medication}</h4>
                    <p><strong>Dosagem:</strong> {prescription.dosage}</p>
                    <p><strong>Frequência:</strong> {prescription.frequency}</p>
                    <p><strong>Duração:</strong> {prescription.duration}</p>
                    {prescription.instructions && <p><strong>Instruções:</strong> {prescription.instructions}</p>}
                    <div className="prescription-actions">
                      <button
                        className="btn-ghost btn-icon btn-delete"
                        onClick={() => handleRemovePrescription(prescription.id)}
                        title="Remover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Solicitação de Exames */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="section-header">
                <h2 className="card-title">Solicitação de Exames</h2>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowExamForm(!showExamForm)}
                >
                  <Plus size={16} style={{ marginRight: '0.25rem' }} />
                  Adicionar
                </button>
              </div>
            </div>
            <div className="card-content">
              {showExamForm && (
                <form onSubmit={handleAddExam} className="mb-4" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="label">Tipo de Exame</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Ex: Hemograma completo"
                        value={examForm.examType}
                        onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group form-group-full">
                      <label className="label">Motivo</label>
                      <textarea
                        className="textarea"
                        value={examForm.reason}
                        onChange={(e) => setExamForm({ ...examForm, reason: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-success btn-sm">Adicionar</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowExamForm(false)}>Cancelar</button>
                  </div>
                </form>
              )}

              {exams.length === 0 ? (
                <p className="empty-state" style={{ padding: '1rem' }}>Nenhum exame solicitado</p>
              ) : (
                exams.map((exam) => (
                  <div key={exam.id} className="exam-item">
                    <h4>{exam.examType}</h4>
                    <p>{exam.reason}</p>
                    <div className="exam-actions">
                      <button
                        className="btn-ghost btn-icon btn-delete"
                        onClick={() => handleRemoveExam(exam.id)}
                        title="Remover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Informações do Paciente */}
        <div>
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Informações do Paciente</h3>
            </div>
            <div className="card-content">
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Email</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{patient.email}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Telefone</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{patient.phone}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Data de Nascimento</p>
                <p style={{ fontWeight: 500, margin: 0 }}>
                  {new Date(patient.dateOfBirth).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Endereço</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{patient.address}</p>
              </div>
            </div>
          </div>

          {triage && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Sinais Vitais</h3>
              </div>
              <div className="card-content">
                <div className="patient-vital-signs">
                  <div className="vital-sign-row">
                    <strong>Pressão Arterial</strong>
                    <span>{triage.bloodPressure}</span>
                  </div>
                  <div className="vital-sign-row">
                    <strong>Temperatura</strong>
                    <span>{triage.temperature}°C</span>
                  </div>
                  <div className="vital-sign-row">
                    <strong>Peso</strong>
                    <span>{triage.weight} kg</span>
                  </div>
                  <div className="vital-sign-row">
                    <strong>Altura</strong>
                    <span>{triage.height} cm</span>
                  </div>
                </div>
                {triage.observations && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Observações:
                    </strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {triage.observations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="consultation-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Cancelar
        </button>
        <button className="btn btn-success" onClick={handleCompleteConsultation}>
          Finalizar Consulta
        </button>
      </div>
    </div>
  );
};
