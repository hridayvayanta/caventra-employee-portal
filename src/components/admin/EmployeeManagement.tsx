import React, { useState } from 'react';
import { UserCheck, UserX, Search, Filter, ShieldCheck, Mail, MapPin, Briefcase, AlertCircle, RefreshCw } from 'lucide-react';
import { User, Department, UserStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface EmployeeManagementProps {
  users: User[];
  onRefresh: () => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ users, onRefresh }) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'All' | Department>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | UserStatus>('All');

  // Confirmation modal state
  const [modalAction, setModalAction] = useState<{
    type: 'approve' | 'reject' | 'deactivate' | 'activate' | 'change_dept';
    user: User;
    newDept?: Department;
  } | null>(null);

  const pendingUsers = users.filter((u) => u.status === 'pending_approval');

  // Filtered roster
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || u.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleApprove = (user: User) => {
    if (!currentUser) return;
    storageService.updateUser(user.id, { status: 'active' }, currentUser);
    toast.success(`Approved registration for ${user.fullName}. Account is now active.`);
    onRefresh();
  };

  const handleConfirmAction = () => {
    if (!modalAction || !currentUser) return;
    const { type, user, newDept } = modalAction;

    if (type === 'reject') {
      storageService.updateUser(user.id, { status: 'rejected' }, currentUser);
      toast.warning(`Application for ${user.fullName} has been rejected.`);
    } else if (type === 'deactivate') {
      storageService.updateUser(user.id, { status: 'deactivated' }, currentUser);
      toast.info(`Account for ${user.fullName} was deactivated.`);
    } else if (type === 'activate') {
      storageService.updateUser(user.id, { status: 'active' }, currentUser);
      toast.success(`Account for ${user.fullName} is now reactivated.`);
    } else if (type === 'change_dept' && newDept) {
      storageService.updateUser(user.id, { department: newDept }, currentUser);
      toast.success(`${user.fullName} reassigned to ${newDept} Department.`);
    }

    setModalAction(null);
    onRefresh();
  };

  return (
    <div>
      {/* Pending Approvals Queue */}
      {pendingUsers.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertCircle size={18} color="var(--warning)" />
            <h2 style={{ fontSize: 18, color: 'var(--tx-heading)' }}>
              Pending Registration Queue ({pendingUsers.length})
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {pendingUsers.map((pending) => (
              <div
                key={pending.id}
                className="card"
                style={{
                  background: 'rgba(201, 184, 160, 0.04)',
                  borderColor: 'var(--gold-border)',
                  padding: 22,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 17, color: 'var(--tx-heading)', marginBottom: 2 }}>
                      {pending.fullName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--tx-muted)' }}>
                      <Mail size={13} />
                      <span>{pending.email}</span>
                    </div>
                  </div>
                  <StatusBadge status={pending.status} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 12,
                    color: 'var(--tx-muted)',
                    margin: '12px 0 18px',
                    padding: '8px 12px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span>
                    Requested Dept: <strong style={{ color: 'var(--gold-light)' }}>{pending.department}</strong>
                  </span>
                  <span>•</span>
                  <span>Position: <strong>{pending.position}</strong></span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-solid btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleApprove(pending)}
                  >
                    <UserCheck size={14} />
                    Approve Access
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setModalAction({ type: 'reject', user: pending })}
                  >
                    <UserX size={14} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roster Controls & Filters */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
            <Search
              size={16}
              color="var(--tx-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>Department:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '7px 28px 7px 12px', fontSize: 13 }}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value as any)}
              >
                <option value="All">All Departments</option>
                <option value="Coding">Coding</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>Status:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '7px 28px 7px 12px', fontSize: 13 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending_approval">Pending Review</option>
                <option value="deactivated">Deactivated</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table / Directory */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--line)', color: 'var(--tx-muted)', fontSize: 12 }}>
                <th style={{ padding: '14px 20px' }}>Employee</th>
                <th style={{ padding: '14px 20px' }}>Department</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Member Since</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--tx-muted)' }}>
                    No employee accounts matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentSuper = user.id === currentUser?.id;
                  return (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.2s' }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: user.role === 'super_admin' ? 'var(--gold-dim)' : 'var(--blue-bg)',
                              border: `1px solid ${user.role === 'super_admin' ? 'var(--gold-border)' : 'var(--blue-border)'}`,
                              color: user.role === 'super_admin' ? 'var(--gold-light)' : 'var(--blue)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {user.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--tx-heading)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{user.fullName}</span>
                              {user.role === 'super_admin' && (
                                <span className="badge badge-admin" style={{ fontSize: 10, padding: '1px 6px' }}>
                                  Founder
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="badge badge-department">
                            {user.role === 'super_admin' ? 'Founders' : user.department}
                          </span>
                          {/* Department Reassign Dropdown for non-super admins */}
                          {user.role !== 'super_admin' && (
                            <select
                              value={user.department}
                              onChange={(e) =>
                                setModalAction({
                                  type: 'change_dept',
                                  user,
                                  newDept: e.target.value as Department,
                                })
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--tx-muted)',
                                fontSize: 11,
                                cursor: 'pointer',
                                padding: 0,
                              }}
                              title="Reassign Department"
                            >
                              <option value="Coding">→ Coding</option>
                              <option value="Sales">→ Sales</option>
                              <option value="HR">→ HR</option>
                            </select>
                          )}
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', display: 'block', marginTop: 2 }}>
                          {user.position}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: 12.5, color: 'var(--tx)' }}>
                          {user.role === 'super_admin' ? 'Founder · Super Admin' : 'Employee'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={user.status} />
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--tx-muted)', fontSize: 12.5 }}>
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        {user.role === 'super_admin' ? (
                          <span style={{ fontSize: 11.5, color: 'var(--gold)' }}>Protected Founder Account</span>
                        ) : (
                          <div style={{ display: 'inline-flex', gap: 8 }}>
                            {user.status === 'pending_approval' && (
                              <button
                                type="button"
                                className="btn btn-solid btn-xs"
                                onClick={() => handleApprove(user)}
                              >
                                Approve
                              </button>
                            )}
                            {user.status === 'active' && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-xs"
                                style={{ color: 'var(--danger)' }}
                                onClick={() => setModalAction({ type: 'deactivate', user })}
                              >
                                Deactivate
                              </button>
                            )}
                            {user.status === 'deactivated' && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-xs"
                                style={{ color: 'var(--success)' }}
                                onClick={() => setModalAction({ type: 'activate', user })}
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={modalAction?.type === 'reject'}
        title="Reject Registration Application"
        message={`Are you sure you want to reject the employee registration for ${modalAction?.user.fullName}? They will not be able to log in to internal Caventra services.`}
        confirmLabel="Reject Application"
        isDestructive={true}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalAction(null)}
      />

      <ConfirmModal
        isOpen={modalAction?.type === 'deactivate'}
        title="Deactivate Employee Account"
        message={`Are you sure you want to deactivate ${modalAction?.user.fullName}'s account? They will be immediately blocked from signing into the portal.`}
        confirmLabel="Deactivate Account"
        isDestructive={true}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalAction(null)}
      />

      <ConfirmModal
        isOpen={modalAction?.type === 'activate'}
        title="Reactivate Employee Account"
        message={`Reactivate ${modalAction?.user.fullName}'s access to the Caventra portal?`}
        confirmLabel="Reactivate Account"
        isDestructive={false}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalAction(null)}
      />

      <ConfirmModal
        isOpen={modalAction?.type === 'change_dept'}
        title="Transfer Department Assignment"
        message={`Are you sure you want to transfer ${modalAction?.user.fullName} to the ${modalAction?.newDept} Department? Their workspace access and task assignment context will be updated.`}
        confirmLabel="Confirm Department Transfer"
        isDestructive={false}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalAction(null)}
      />
    </div>
  );
};
