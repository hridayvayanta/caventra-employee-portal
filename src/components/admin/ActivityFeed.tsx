import React, { useState } from 'react';
import { Clock, UserPlus, CheckCircle2, UserCheck, UserX, AlertTriangle, FileText, ArrowRight, Filter } from 'lucide-react';
import { ActivityEvent, Department } from '../../types';

interface ActivityFeedProps {
  activity: ActivityEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity }) => {
  const [departmentFilter, setDepartmentFilter] = useState<'All' | Department>('All');

  const filteredEvents = activity.filter((event) => {
    if (departmentFilter === 'All') return true;
    return event.department === departmentFilter;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'employee_registered':
        return <UserPlus size={16} color="var(--warning)" />;
      case 'employee_approved':
        return <UserCheck size={16} color="var(--success)" />;
      case 'employee_rejected':
      case 'employee_deactivated':
        return <UserX size={16} color="var(--danger)" />;
      case 'task_created':
        return <FileText size={16} color="var(--blue)" />;
      case 'task_completed':
        return <CheckCircle2 size={16} color="var(--success)" />;
      case 'task_blocked':
        return <AlertTriangle size={16} color="var(--danger)" />;
      default:
        return <Clock size={16} color="var(--gold)" />;
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, color: 'var(--tx-heading)', marginBottom: 2 }}>
            Organizational Audit &amp; Activity Log
          </h2>
          <p style={{ fontSize: 13, color: 'var(--tx-muted)', margin: 0 }}>
            Chronological audit trail of team registrations, approvals, and milestone deliverables
          </p>
        </div>

        {/* Filter by Department */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>Filter Department:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '6px 28px 6px 10px', fontSize: 12.5 }}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value as any)}
          >
            <option value="All">All Events</option>
            <option value="Coding">Coding</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p style={{ color: 'var(--tx-muted)', margin: 0 }}>No audit events logged for this filter.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 8 }}>
            {/* Timeline vertical bar */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                bottom: 8,
                left: 23,
                width: 2,
                background: 'var(--line)',
                zIndex: 0,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
              {filteredEvents.map((evt) => (
                <div key={evt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  {/* Event Node Icon */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--bg-card-elevated)',
                      border: '1px solid var(--line-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getEventIcon(evt.type)}
                  </div>

                  {/* Event Content */}
                  <div
                    style={{
                      flex: 1,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx-heading)' }}>
                          {evt.actorName}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--tx-muted)' }}>
                          ({evt.actorRole === 'super_admin' ? 'Super Admin' : 'Employee'})
                        </span>
                        {evt.department && (
                          <span className="badge badge-department" style={{ fontSize: 10.5, padding: '1px 6px' }}>
                            {evt.department}
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>
                        {new Date(evt.timestamp).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.45 }}>
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
