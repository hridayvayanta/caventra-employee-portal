import React, { useState } from 'react';
import { Briefcase, Users, Plus, CheckCircle2, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { User, Task, Department, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';

interface DepartmentManagementProps {
  users: User[];
  tasks: Task[];
  initialDepartment?: Department;
  onOpenCreateTaskForDept: (dept: Department) => void;
  onSelectTask: (task: Task) => void;
}

export const DepartmentManagement: React.FC<DepartmentManagementProps> = ({
  users,
  tasks,
  initialDepartment = 'Coding',
  onOpenCreateTaskForDept,
  onSelectTask,
}) => {
  const [selectedDept, setSelectedDept] = useState<Department>(initialDepartment);
  const [taskStatusFilter, setTaskStatusFilter] = useState<'All' | TaskStatus>('All');

  const deptMembers = users.filter((u) => u.department === selectedDept && u.status === 'active');
  const deptTasks = tasks.filter((t) => t.department === selectedDept);

  const filteredDeptTasks = deptTasks.filter((t) => {
    if (taskStatusFilter === 'All') return true;
    return t.status === taskStatusFilter;
  });

  const completedCount = deptTasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = deptTasks.filter((t) => t.status === 'In Progress').length;
  const blockedCount = deptTasks.filter((t) => t.status === 'Blocked').length;
  const overdueCount = deptTasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.deadline) < new Date()
  ).length;

  const completionRate = deptTasks.length > 0 ? Math.round((completedCount / deptTasks.length) * 100) : 0;

  // Recent task updates in this department
  const recentUpdates = deptTasks
    .flatMap((t) => t.updates.map((u) => ({ ...u, taskTitle: t.title, task: t })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  return (
    <div>
      {/* Department Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          borderBottom: '1px solid var(--line)',
          paddingBottom: 12,
        }}
      >
        {(['Coding', 'Sales', 'HR'] as Department[]).map((dept) => {
          const isSelected = selectedDept === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`btn btn-sm ${isSelected ? 'btn-solid' : 'btn-secondary'}`}
              style={{ padding: '8px 24px', fontSize: 14 }}
            >
              <Briefcase size={15} />
              <span>{dept} Department</span>
            </button>
          );
        })}
      </div>

      {/* Department Header & KPIs */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: 24,
          background: 'linear-gradient(135deg, rgba(20, 24, 28, 0.9) 0%, rgba(26, 32, 38, 0.8) 100%)',
          borderColor: 'var(--gold-border)',
        }}
      >
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, color: 'var(--tx-heading)' }}>{selectedDept} Operations</h2>
              <span className="badge badge-admin">{deptMembers.length} Active Personnel</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--tx-muted)', margin: 0 }}>
              {selectedDept === 'Coding' && 'Full-stack engineering, bespoke web applications, AI automation, and cloud microservices.'}
              {selectedDept === 'Sales' && 'Client partnerships, commercial agreements, enterprise technical discovery, and RFPs.'}
              {selectedDept === 'HR' && 'Talent acquisition, employee experience, performance alignment, and company culture.'}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-solid btn-sm"
            onClick={() => onOpenCreateTaskForDept(selectedDept)}
          >
            <Plus size={15} />
            Create Task for {selectedDept}
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            borderTop: '1px solid var(--line)',
            paddingTop: 18,
          }}
        >
          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>Assigned Tasks</span>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tx-heading)', fontFamily: 'var(--hd)' }}>
              {deptTasks.length}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>In Progress</span>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--hd)' }}>
              {inProgressCount}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>Completed</span>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--hd)' }}>
              {completedCount} ({completionRate}%)
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>Blocked</span>
            <div style={{ fontSize: 24, fontWeight: 700, color: blockedCount > 0 ? 'var(--danger)' : 'var(--tx)', fontFamily: 'var(--hd)' }}>
              {blockedCount}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>Overdue</span>
            <div style={{ fontSize: 24, fontWeight: 700, color: overdueCount > 0 ? 'var(--danger)' : 'var(--tx)', fontFamily: 'var(--hd)' }}>
              {overdueCount}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Team Roster + Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Team Members */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Users size={18} color="var(--gold)" />
            <h3 style={{ fontSize: 17, color: 'var(--tx-heading)' }}>
              {selectedDept} Team Members ({deptMembers.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {deptMembers.map((member) => {
              const memberTasks = deptTasks.filter((t) => t.assigneeId === member.id);
              const activeMemberTasks = memberTasks.filter((t) => t.status !== 'Completed').length;
              return (
                <div key={member.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: member.role === 'super_admin' ? 'var(--gold-dim)' : 'var(--blue-bg)',
                        border: `1px solid ${member.role === 'super_admin' ? 'var(--gold-border)' : 'var(--blue-border)'}`,
                        color: member.role === 'super_admin' ? 'var(--gold-light)' : 'var(--blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {member.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--tx-heading)', fontSize: 14 }}>
                        {member.fullName}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--tx-muted)' }}>{member.position}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--gold)', marginTop: 4 }}>
                        {activeMemberTasks} active {activeMemberTasks === 1 ? 'task' : 'tasks'} assigned
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Department Task Updates */}
          {recentUpdates.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Clock size={16} color="var(--gold)" />
                <h4 style={{ fontSize: 15, color: 'var(--tx-heading)' }}>Recent Work Updates</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentUpdates.map((u) => (
                  <div
                    key={u.id}
                    className="card card-interactive"
                    style={{ padding: 12, fontSize: 12 }}
                    onClick={() => onSelectTask(u.task)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong style={{ color: 'var(--gold-light)' }}>{u.authorName}</strong>
                      <span style={{ color: 'var(--tx-muted)' }}>
                        {new Date(u.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ color: 'var(--tx)', marginBottom: 4 }}>
                      Task: <span style={{ textDecoration: 'underline' }}>{u.taskTitle}</span>
                    </div>
                    <p style={{ color: 'var(--tx-muted)', margin: 0, fontStyle: 'italic', fontSize: 11.5 }}>
                      "{u.note}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Assigned Tasks List */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <h3 style={{ fontSize: 17, color: 'var(--tx-heading)' }}>
              Tasks in {selectedDept} ({filteredDeptTasks.length})
            </h3>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(['All', 'To Do', 'In Progress', 'Blocked', 'Completed'] as const).map((st) => (
                <button
                  key={st}
                  className={`btn btn-xs ${taskStatusFilter === st ? 'btn-solid' : 'btn-secondary'}`}
                  onClick={() => setTaskStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredDeptTasks.length === 0 ? (
              <div className="card empty-state">
                <p style={{ color: 'var(--tx-muted)', margin: 0 }}>
                  No tasks matching the "{taskStatusFilter}" filter in {selectedDept}.
                </p>
              </div>
            ) : (
              filteredDeptTasks.map((t) => {
                const isOverdue = t.status !== 'Completed' && new Date(t.deadline) < new Date();
                return (
                  <div
                    key={t.id}
                    className="card card-interactive"
                    style={{ padding: 18 }}
                    onClick={() => onSelectTask(t)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h4 style={{ fontSize: 15, color: 'var(--tx-heading)', flex: 1, paddingRight: 10 }}>
                        {t.title}
                      </h4>
                      <StatusBadge status={t.status} />
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--tx-muted)',
                        marginBottom: 12,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.45,
                      }}
                    >
                      {t.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        color: 'var(--tx-muted)',
                        borderTop: '1px solid var(--line)',
                        paddingTop: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>👤 {t.assigneeName}</span>
                        <span>•</span>
                        <PriorityBadge priority={t.priority} />
                      </div>

                      <div style={{ color: isOverdue ? 'var(--danger)' : 'var(--tx-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                        Due: {new Date(t.deadline).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
