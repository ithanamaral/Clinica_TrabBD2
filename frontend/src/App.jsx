import React, { useState } from 'react';
import { AppProvider, useApp } from '@/app/context/AppContext';
import { Login } from '@/app/components/Login';
import { Sidebar, TopBar } from '@/app/components/Layout';
import { ReceptionistDashboard } from '@/app/components/receptionist/Dashboard';
import { UserManagement } from '@/app/components/receptionist/UserManagement';
import { Scheduling } from '@/app/components/receptionist/Scheduling';
import { TriagePage } from '@/app/components/nurse/TriagePage';
import { PharmacyPage } from '@/app/components/nurse/PharmacyPage';
import { DoctorQueue } from '@/app/components/doctor/DoctorQueue';
import { ConsultationPage } from '@/app/components/doctor/ConsultationPage';
import '@/styles/global.css';
import '@/styles/App.css';

const AppContent = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultationAppointmentId, setConsultationAppointmentId] = useState(null);

  if (!currentUser) {
    return <Login />;
  }

  const getDefaultPage = () => {
    if (currentUser.role === 'recepcionista' || currentUser.role === 'admin') {
      return 'dashboard';
    } else if (currentUser.role === 'enfermeiro') {
      return 'triage';
    } else if (currentUser.role === 'medico') {
      return 'queue';
    }
    return 'dashboard';
  };

  const actualPage = currentPage || getDefaultPage();

  const renderPage = () => {
    // Handle doctor consultation flow
    if (consultationAppointmentId && currentUser.role === 'medico') {
      return (
        <ConsultationPage
          appointmentId={consultationAppointmentId}
          onBack={() => {
            setConsultationAppointmentId(null);
            setCurrentPage('queue');
          }}
        />
      );
    }

    // Receptionist pages
    if (currentUser.role === 'recepcionista' || currentUser.role === 'admin') {
      switch (actualPage) {
        case 'dashboard':
          return <ReceptionistDashboard />;
        case 'users':
          return <UserManagement />;
        case 'scheduling':
          return <Scheduling />;
        default:
          return <ReceptionistDashboard />;
      }
    }

    // Nurse pages
    if (currentUser.role === 'enfermeiro') {
      switch (actualPage) {
        case 'triage':
          return <TriagePage />;
        case 'pharmacy':
          return <PharmacyPage />;
        default:
          return <TriagePage />;
      }
    }

    // Doctor pages
    if (currentUser.role === 'medico') {
      switch (actualPage) {
        case 'queue':
          return <DoctorQueue onStartConsultation={setConsultationAppointmentId} />;
        case 'consultation':
          return consultationAppointmentId ? (
            <ConsultationPage
              appointmentId={consultationAppointmentId}
              onBack={() => {
                setConsultationAppointmentId(null);
                setCurrentPage('queue');
              }}
            />
          ) : (
            <DoctorQueue onStartConsultation={setConsultationAppointmentId} />
          );
        default:
          return <DoctorQueue onStartConsultation={setConsultationAppointmentId} />;
      }
    }

    return <ReceptionistDashboard />;
  };

  return (
    <div className="app-container">
      <Sidebar
        currentPage={actualPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setConsultationAppointmentId(null);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main-wrapper">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-main-content">
          <div className="app-content-container">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
