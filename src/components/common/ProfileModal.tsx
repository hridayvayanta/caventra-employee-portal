import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Briefcase, Calendar, MapPin, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from './StatusBadge';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onProfileUpdated }) => {
  const { currentUser, updateProfile } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [position, setPosition] = useState(currentUser?.position || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      position: position.trim(),
      location: location.trim(),
      bio: bio.trim(),
    });
    toast.success('Your profile details have been updated.');
    if (onProfileUpdated) onProfileUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserIcon size={18} />
            </div>
            <div>
              <h3 id="profile-modal-title" style={{ fontSize: 18 }}>
                Employee Profile
              </h3>
              <p style={{ fontSize: 12, color: 'var(--tx-muted)', margin: 0 }}>
                {currentUser.role === 'super_admin' ? 'Super-Admin Account' : 'Team Member Account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--tx-muted)',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Account Metadata Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--tx-muted)', marginBottom: 4 }}>Department</div>
                <div style={{ fontWeight: 600, color: 'var(--tx-heading)', fontSize: 14 }}>
                  {currentUser.department}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--tx-muted)', marginBottom: 4 }}>Account Status</div>
                <StatusBadge status={currentUser.status} />
              </div>

              <div
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--tx-muted)', marginBottom: 4 }}>Member Since</div>
                <div style={{ fontSize: 13, color: 'var(--tx)' }}>
                  {new Date(currentUser.joinedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-email">
                Work Email Address
              </label>
              <input
                id="prof-email"
                type="text"
                className="form-control"
                value={currentUser.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: 11, color: 'var(--tx-muted)' }}>
                Work email can only be updated by Caventra Super-Admin.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-pos">
                Job Title / Position
              </label>
              <input
                id="prof-pos"
                type="text"
                className="form-control"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-loc">
                Location / Working Timezone
              </label>
              <input
                id="prof-loc"
                type="text"
                className="form-control"
                placeholder="e.g. Ahmedabad, India or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-bio">
                Professional Bio / Focus Areas
              </label>
              <textarea
                id="prof-bio"
                className="form-control"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your expertise and current Caventra initiatives."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-solid btn-sm">
              <Check size={14} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
