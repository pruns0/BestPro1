import React, { useState } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import PublicTracking from './components/PublicTracking';
import UserManagement from './components/UserManagement';
import TUDashboard from './components/TUDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import StaffDashboard from './components/StaffDashboard';
import { useAuth } from './hooks/useAuth';
import { useReports } from './hooks/useReports';

function App() {
  const { 
    currentUser, 
    users, 
    login, 
    logout, 
    createUser, 
    updateUser, 
    deleteUser 
  } = useAuth();
  
  const { 
    reports, 
    createReport, 
    updateReport, 
    addHistoryEntry, 
    getReportsByRole 
  } = useReports();
  
  const [currentView, setCurrentView] = useState('dashboard');

  const handleForwardReport = (reportId: string, coordinators: string[]) => {
    updateReport(reportId, {
      assignedCoordinators: coordinators,
      status: 'Document Verification'
    });
    addHistoryEntry(reportId, {
      action: `Forwarded to ${coordinators.length} coordinator(s)`,
      actor: 'Bagian TU'
    });
  };

  if (!currentUser) {
    return <Login onLogin={login} />;
  }

  const userReports = getReportsByRole(currentUser.role, currentUser.name);

  const renderContent = () => {
    if (currentView === 'public-tracking') {
      return <PublicTracking reports={reports} />;
    }

    if (currentView === 'user-management' && currentUser.role === 'Admin') {
      return (
        <UserManagement
          users={users}
          onCreateUser={createUser}
          onUpdateUser={updateUser}
          onDeleteUser={deleteUser}
        />
      );
    }

    // Dashboard based on user role
    switch (currentUser.role) {
      case 'TU':
        return (
          <TUDashboard
            reports={userReports}
            onCreateReport={createReport}
            onUpdateReport={updateReport}
            onForwardReport={handleForwardReport}
          />
        );
      case 'Coordinator':
        return (
          <CoordinatorDashboard
            reports={userReports}
            currentUser={currentUser}
            onUpdateReport={updateReport}
            onAddHistory={addHistoryEntry}
          />
        );
      case 'Staff':
        return (
          <StaffDashboard
            reports={userReports}
            currentUser={currentUser}
            onUpdateReport={updateReport}
            onAddHistory={addHistoryEntry}
          />
        );
      case 'Admin':
        return (
          <TUDashboard
            reports={reports}
            onCreateReport={createReport}
            onUpdateReport={updateReport}
            onForwardReport={handleForwardReport}
          />
        );
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogout={logout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {renderContent()}
    </div>
  );
}

export default App;