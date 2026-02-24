import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import '../../styles/Consultation.css';

export const ConsultationPage = ({ appointmentId, onBack }) => {
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [triage, setTriage] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);

  const [resumo, setResumo] = useState('');
  const [cidPrin, setCidPrin] = useState('');
  const [cidSecun, setCidSecun] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({ medication: '', dosage: '', validade: '' });

  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const storedUser = localStorage.getItem('@Clinica:user');
        const userObj = storedUser ? JSON.parse(storedUser) : null;
        const token = userObj?.token || '';
        const headers = { 'Authorization': `Bearer ${token}` };

        if (userObj?.role === 'admin') {
          const resMed = await fetch('http://localhost:3001/medicos', { headers });
          if (resMed.ok) setDoctors(await resMed.json());
        } else {
          setSelectedDoctorId(userObj?.id || userObj?._id);
        }

        const resApt = await fetch('http://localhost:3001/agendamento/medico', { headers });
        if (resApt.ok) {
          const apts = await resApt.json();
          const currentApt = apts.find(a => (a.id || a._id) === appointmentId);
          setAppointment(currentApt);

          if (currentApt) {
            const patientId = currentApt.id_paci || currentApt.paciente_id;
            const resPac = await fetch('http://localhost:3001/pacientes', { headers });
            if (resPac.ok) {
              const pacs = await resPac.json();
              setPatient(pacs.find(p => (p.id || p._id) === patientId));
            }

            const resTri = await fetch('http://localhost:3001/triagem/medico', { headers });
            if (resTri.ok) {
              const tris = await resTri.json();
              setTriage(tris.find(t => (t.id_agen || t.id_agend) === appointmentId));
            }
          }
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchConsultationData();
  }, [appointmentId]);

  const handleCompleteConsultation = async () => {
    const storedUser = localStorage.getItem('@Clinica:user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const token = userObj?.token || '';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    if (!selectedDoctorId) return alert('Por favor, selecione o médico responsável.');
    if (!resumo || !cidPrin) return alert('Resumo e CID Principal são obrigatórios!');

    try {
      const evolucaoPayload = {
        resumo,
        cid_prin: cidPrin,
        cid_secun: cidSecun || 'N/A',
        id_medic: selectedDoctorId, 
        id_paci: patient?._id || patient?.id
      };

      const resEvo = await fetch('http://localhost:3001/evolucao', { method: 'POST', headers, body: JSON.stringify(evolucaoPayload) });
      if (!resEvo.ok) throw new Error('Erro ao salvar evolução');

      const evoData = await resEvo.json();
      const evoId = evoData.id || evoData._id || evoData.insertedId;

      for (const rx of prescriptions) {
        await fetch('http://localhost:3001/receitas', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id_paci: patient?._id || patient?.id,
            id_medic: selectedDoctorId,
            id_evolu: evoId,
            descricao: `${rx.medication} - ${rx.dosage}`,
            validade: rx.validade,
            emissao: new Date().toISOString()
          })
        });
      }

      await fetch('http://localhost:3001/agendamento/medico', { method: 'PUT', headers, body: JSON.stringify({ id_agend: appointmentId, status: true }) });
      alert('Consulta finalizada com sucesso!');
      onBack();
    } catch (error) { alert(`Erro: ${error.message}`); }
  };

  if (loading) return <div className="p-4">Carregando consulta...</div>;

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <div className="consultation-header-content">
          <h1>Consulta - {patient?.nome || 'Paciente'}</h1>
          <p>CPF: {patient?.cpf}</p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}><ArrowLeft size={16} /> Voltar</button>
      </div>

      <div className="consultation-grid">
        <div className="consultation-main">
          {/* Seleção de Médico para Admin */}
          {JSON.parse(localStorage.getItem('@Clinica:user'))?.role === 'admin' && (
            <div className="card mb-4" style={{ border: '1px solid #ca8a04' }}>
              <div className="card-header"><h2 className="card-title">Responsabilidade Administrativa</h2></div>
              <div className="card-content">
                <label className="label">Médico Responsável pelo Atendimento</label>
                <select className="select" value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} required>
                  <option value="">Selecione o médico...</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.nome} - CRM: {d.crm}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="card mb-4">
            <div className="card-header"><h2 className="card-title">Evolução Clínica</h2></div>
            <div className="card-content">
              <div className="form-grid mb-3">
                <div className="form-group"><label className="label">CID Principal *</label><input className="input" value={cidPrin} onChange={(e) => setCidPrin(e.target.value)} /></div>
                <div className="form-group"><label className="label">CID Secundário</label><input className="input" value={cidSecun} onChange={(e) => setCidSecun(e.target.value)} /></div>
              </div>
              <label className="label">Resumo do Atendimento *</label>
              <textarea className="textarea" rows="8" value={resumo} onChange={(e) => setResumo(e.target.value)} />
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <div className="section-header">
                <h2 className="card-title">Prescrições</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}><Plus size={16} /> Adicionar</button>
              </div>
            </div>
            <div className="card-content">
              {showPrescriptionForm && (
                <div className="prescription-form mb-4 p-3 border rounded">
                  <div className="form-grid">
                    <input className="input" placeholder="Medicamento" value={prescriptionForm.medication} onChange={(e) => setPrescriptionForm({...prescriptionForm, medication: e.target.value})} />
                    <input className="input" placeholder="Dosagem" value={prescriptionForm.dosage} onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})} />
                    <input className="input" placeholder="Validade" value={prescriptionForm.validade} onChange={(e) => setPrescriptionForm({...prescriptionForm, validade: e.target.value})} />
                  </div>
                  <button className="btn btn-success btn-sm mt-3" onClick={() => { setPrescriptions([...prescriptions, {...prescriptionForm, id: Date.now()}]); setShowPrescriptionForm(false); setPrescriptionForm({ medication: '', dosage: '', validade: '' }); }}>Salvar Item</button>
                </div>
              )}
              {prescriptions.map(p => (
                <div key={p.id} className="prescription-item" style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee'}}>
                  <span>{p.medication} - {p.dosage}</span>
                  <button className="btn-remove-mini" onClick={() => setPrescriptions(prescriptions.filter(i => i.id !== p.id))}><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="consultation-sidebar">
          {triage && (
            <div className="card info-card">
              <div className="card-header"><h3 className="card-title">Sinais Vitais (Triagem)</h3></div>
              <div className="card-content">
                <p><strong>Sinais:</strong> {triage.sinais_vitais}</p>
                <p><strong>Peso:</strong> {triage.peso} kg | <strong>Alt:</strong> {triage.altura} cm</p>
                <p><strong>Classificação:</strong> <span className={`badge classification-${triage.classificacao}`}>{triage.classificacao}</span></p>
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="consultation-actions">
        <button className="btn btn-secondary" onClick={onBack}>Cancelar</button>
        <button className="btn btn-success" onClick={handleCompleteConsultation}>Finalizar Consulta</button>
      </div>
    </div>
  );
};