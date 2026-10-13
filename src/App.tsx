import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { DemoBanner } from './components/common/DemoBanner';
import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { EmployeeWorkspace } from './components/employee/EmployeeWorkspace';
import { storageService } from './services/storage';
import { User, Task, ActivityEvent } from './types';

const MainPortal: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  const loadData = useCallback(() => {
    setUsers(storageService.getUsers());
    setTasks(storageService.getTasks());
    setActivity(storageService.getActivity(60));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--bg)',
          color: 'var(--gold-light)',
          fontFamily: 'var(--bd)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="./assets/logo-nav.png"
            alt="Caventra"
            style={{ height: 48, margin: '0 auto 16px', opacity: 0.9 }}
          />
          <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Initializing Caventra Workspace…
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoBanner onRefreshNeeded={loadData} />
      <Navbar onRefreshNeeded={loadData} />

      <main style={{ flex: 1 }}>
        {currentUser.role === 'super_admin' ? (
          <AdminWorkspace
            users={users}
            tasks={tasks}
            activity={activity}
            onRefresh={loadData}
          />
        ) : (
          <EmployeeWorkspace
            users={users}
            tasks={tasks}
            onRefresh={loadData}
          />
        )}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--line)',
          padding: '24px 0',
          marginTop: 'auto',
          background: 'rgba(11, 14, 17, 0.8)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12.5,
            color: 'var(--tx-muted)',
          }}
        >
          <div>
            <span>© {new Date().getFullYear()} </span>
            <strong style={{ color: 'var(--tx)' }}>CAVENTRA</strong>
            <span> · Ideas to Impact. Internal Employee Management Portal.</span>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <span>Security Level: Role-Enforced</span>
            <span>•</span>
            <span>Static GitHub Pages Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainPortal />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
