import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [triages, setTriages] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [examRequests, setExamRequests] = useState([]);

  const login = (userData) => {
  if (userData && userData.email) {
    // Agora aceitamos o objeto que vem do Login.jsx
    setCurrentUser({
      name: userData.nome,
      email: userData.email,
      role: userData.role, // Aqui é onde o App.jsx decide a página
      token: userData.token
    });

    // Salva no localStorage para não deslogar ao dar F5
    localStorage.setItem('@Clinica:user', JSON.stringify(userData));
    
    return true;
  }
  return false;
};

  const logout = () => {
    setCurrentUser(null);
  };

  // Patient CRUD
  const addPatient = (patient) => {
    const newPatient = { ...patient, id: Date.now().toString() };
    setPatients([...patients, newPatient]);
  };

  const updatePatient = (id, patient) => {
    setPatients(patients.map((p) => (p.id === id ? { ...p, ...patient } : p)));
  };

  const deletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  // Doctor CRUD
  const addDoctor = (doctor) => {
    const newDoctor = { ...doctor, id: Date.now().toString() };
    setDoctors([...doctors, newDoctor]);
  };

  const updateDoctor = (id, doctor) => {
    setDoctors(doctors.map((d) => (d.id === id ? { ...d, ...doctor } : d)));
  };

  const deleteDoctor = (id) => {
    setDoctors(doctors.filter((d) => d.id !== id));
  };

  // Nurse CRUD
  const addNurse = (nurse) => {
    const newNurse = { ...nurse, id: Date.now().toString() };
    setNurses([...nurses, newNurse]);
  };

  const updateNurse = (id, nurse) => {
    setNurses(nurses.map((n) => (n.id === id ? { ...n, ...nurse } : n)));
  };

  const deleteNurse = (id) => {
    setNurses(nurses.filter((n) => n.id !== id));
  };

  // Receptionist CRUD
  const addReceptionist = (receptionist) => {
    const newReceptionist = { ...receptionist, id: Date.now().toString() };
    setReceptionists([...receptionists, newReceptionist]);
  };

  const updateReceptionist = (id, receptionist) => {
    setReceptionists(receptionists.map((r) => (r.id === id ? { ...r, ...receptionist } : r)));
  };

  const deleteReceptionist = (id) => {
    setReceptionists(receptionists.filter((r) => r.id !== id));
  };

  // Appointment CRUD
  const addAppointment = (appointment) => {
    const newAppointment = { ...appointment, id: Date.now().toString() };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (id, appointment) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, ...appointment } : a)));
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  // Triage
  const addTriage = (triage) => {
    const newTriage = { ...triage, id: Date.now().toString() };
    setTriages([...triages, newTriage]);
    // Update appointment to mark triage as completed
    updateAppointment(triage.appointmentId, { triageCompleted: true });
  };

  const updateTriage = (id, triage) => {
    setTriages(triages.map((t) => (t.id === id ? { ...t, ...triage } : t)));
  };

  // Medication
  const addMedication = (medication) => {
    const newMedication = { ...medication, id: Date.now().toString() };
    setMedications([...medications, newMedication]);
  };

  const updateMedication = (id, medication) => {
    setMedications(medications.map((m) => (m.id === id ? { ...m, ...medication } : m)));
  };

  const dispenseMedication = (id, quantity, patientId) => {
    setMedications(
      medications.map((m) => {
        if (m.id === id && m.quantity >= quantity) {
          return { ...m, quantity: m.quantity - quantity };
        }
        return m;
      })
    );
  };

  // Medical Record
  const addMedicalRecord = (record) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setMedicalRecords([...medicalRecords, newRecord]);
  };

  // Prescription
  const addPrescription = (prescription) => {
    const newPrescription = { ...prescription, id: Date.now().toString() };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  // Exam Request
  const addExamRequest = (request) => {
    const newRequest = { ...request, id: Date.now().toString() };
    setExamRequests([...examRequests, newRequest]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        nurses,
        addNurse,
        updateNurse,
        deleteNurse,
        receptionists,
        addReceptionist,
        updateReceptionist,
        deleteReceptionist,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        triages,
        addTriage,
        updateTriage,
        medications,
        addMedication,
        updateMedication,
        dispenseMedication,
        medicalRecords,
        addMedicalRecord,
        prescriptions,
        addPrescription,
        examRequests,
        addExamRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
