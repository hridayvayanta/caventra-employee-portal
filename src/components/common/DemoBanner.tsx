import React, { useState } from 'react';
import { ShieldAlert, Users, Settings2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { BackendConfigModal } from './BackendConfigModal';

interface DemoBannerProps {
  onRefreshNeeded?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onRefreshNeeded }) => {
  const { isDemoMode, demoSwitchUser, currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  if (!isDemoMode) return null;

  const users = storageService.getUsers().filter((u) => u.status === 'active');
  const superAdmins = users.filter((u) => u.role === 'super_admin');
  const codingMembers = users.filter((u) => u.role === 'employee' && u.department === 'Coding');
  const salesMembers = users.filter((u) => u.role === 'employee' && u.department === 'Sales');
  const hrMembers = users.filter((u) => u.role === 'employee' && u.department === 'HR');

  return (
    <>
      <div
        style={{
          background: 'linear-gradient(90deg, #181d22 0%, #1c2229 100%)',
          borderBottom: '1px solid var(--line-light)',
          color: 'var(--tx)',
          fontSize: 12.5,
          padding: '8px 20px',
        }}
      >
        <div
          style={{
            maxWidth: 1360,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.04em',
              }}
            >
              <ShieldAlert size={12} />
              PROTOTYPE / DEMO MODE
            </span>
            <span style={{ color: 'var(--tx-muted)' }}>
              Static deployment on GitHub Pages. Evaluation state stored in browser LocalStorage.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-secondary btn-xs"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              title="Quick Switch Evaluation Persona"
            >
              <Users size={12} />
              <span>Switch Persona</span>
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <button
              onClick={() => setShowConfigModal(true)}
              className="btn btn-secondary btn-xs"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              title="Backend Integration Settings"
            >
              <Settings2 size={12} />
              <span>Backend Config</span>
            </button>
          </div>
        </div>

        {/* Expandable Persona Selector */}
        {isExpanded && (
          <div
            style={{
              maxWidth: 1360,
              margin: '10px auto 4px',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase' }}>
                Founders (Super Admin):
              </span>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {superAdmins.map((admin) => (
                  <button
                    key={admin.id}
                    className={`btn btn-xs ${currentUser?.id === admin.id ? 'btn-solid' : 'btn-secondary'}`}
                    onClick={() => {
                      demoSwitchUser(admin.id);
                      if (onRefreshNeeded) onRefreshNeeded();
                    }}
                  >
                    {admin.fullName} (Founder)
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--blue)', fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase' }}>
                Coding:
              </span>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {codingMembers.slice(0, 2).map((m) => (
                  <button
                    key={m.id}
                    className={`btn btn-xs ${currentUser?.id === m.id ? 'btn-solid' : 'btn-secondary'}`}
                    onClick={() => {
                      demoSwitchUser(m.id);
                      if (onRefreshNeeded) onRefreshNeeded();
                    }}
                  >
                    {m.fullName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase' }}>
                Sales:
              </span>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {salesMembers.slice(0, 2).map((m) => (
                  <button
                    key={m.id}
                    className={`btn btn-xs ${currentUser?.id === m.id ? 'btn-solid' : 'btn-secondary'}`}
                    onClick={() => {
                      demoSwitchUser(m.id);
                      if (onRefreshNeeded) onRefreshNeeded();
                    }}
                  >
                    {m.fullName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ color: '#c084fc', fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase' }}>
                HR:
              </span>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {hrMembers.slice(0, 2).map((m) => (
                  <button
                    key={m.id}
                    className={`btn btn-xs ${currentUser?.id === m.id ? 'btn-solid' : 'btn-secondary'}`}
                    onClick={() => {
                      demoSwitchUser(m.id);
                      if (onRefreshNeeded) onRefreshNeeded();
                    }}
                  >
                    {m.fullName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BackendConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onDataReset={onRefreshNeeded}
      />
    </>
  );
};
