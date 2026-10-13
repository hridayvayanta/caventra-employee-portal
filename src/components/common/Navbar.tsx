import React, { useState } from 'react';
import { LogOut, User as UserIcon, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import { ProfileModal } from './ProfileModal';
import { storageService } from '../../services/storage';

interface NavbarProps {
  onRefreshNeeded?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefreshNeeded }) => {
  const { currentUser, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return null;

  const announcements = storageService.getAnnouncements(
    currentUser.role === 'super_admin' ? undefined : currentUser.department
  );

  return (
    <>
      <header className="portal-nav">
        <div className="portal-nav-wrap">
          {/* Brand Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img
              src="./assets/logo-nav.png"
              alt="Caventra — Ideas to Impact"
              style={{ height: 44, width: 'auto', display: 'block' }}
              onError={(e) => {
                // Fallback if logo-nav is not resolved
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--hd)',
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: 'var(--gold-light)',
                  }}
                >
                  CAVENTRA
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--tx-muted)',
                    borderLeft: '1px solid var(--line-light)',
                    paddingLeft: 8,
                  }}
                >
                  Internal Portal
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--tx-muted)' }}>
                {currentUser.role === 'super_admin' ? 'Founders · Super-Admin Operations' : `${currentUser.department} Department`}
              </span>
            </div>
          </div>

          {/* User Controls & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Notifications Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-icon-only"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Announcements & Alerts"
                aria-label="View announcements"
              >
                <Bell size={16} />
                {announcements.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      boxShadow: '0 0 6px var(--gold)',
                    }}
                  />
                )}
              </button>

              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 320,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--line-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    boxShadow: 'var(--shadow-modal)',
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      borderBottom: '1px solid var(--line)',
                      paddingBottom: 8,
                    }}
                  >
                    <strong style={{ fontSize: 13, color: 'var(--tx-heading)' }}>Caventra Updates</strong>
                    <span style={{ fontSize: 11, color: 'var(--gold)' }}>{announcements.length} recent</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
                    {announcements.map((anc) => (
                      <div
                        key={anc.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--line)',
                          borderRadius: 'var(--radius-sm)',
                          padding: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold-light)' }}>
                            {anc.title}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--tx-muted)' }}>{anc.date}</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: 'var(--tx)', margin: 0, lineHeight: 1.4 }}>
                          {anc.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Chip */}
            <div
              onClick={() => setShowProfileModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--line-light)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              title="Click to view/edit profile"
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: currentUser.role === 'super_admin' ? 'var(--gold-dim)' : 'var(--blue-bg)',
                  border: `1px solid ${currentUser.role === 'super_admin' ? 'var(--gold-border)' : 'var(--blue-border)'}`,
                  color: currentUser.role === 'super_admin' ? 'var(--gold-light)' : 'var(--blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {currentUser.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx-heading)', lineHeight: 1.2 }}>
                  {currentUser.fullName}
                </span>
                <span style={{ fontSize: 10.5, color: 'var(--tx-muted)' }}>
                  {currentUser.role === 'super_admin' ? 'Founder · Super Admin' : currentUser.position}
                </span>
              </div>

              <ChevronDown size={14} color="var(--tx-muted)" />
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Sign out of employee portal"
              aria-label="Sign out"
            >
              <LogOut size={14} />
              <span className="hide-mobile">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileUpdated={onRefreshNeeded}
      />
    </>
  );
};
