import React from 'react';
import { Users, UserCheck, Clock, CheckCircle2, AlertTriangle, ListTodo, Briefcase, TrendingUp } from 'lucide-react';
import { User, Task, Department } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';

interface CompanyOverviewProps {
  users: User[];
  tasks: Task[];
  onSelectTab: (tab: string) => void;
  onSelectDepartment: (dept: Department) => void;
  onOpenCreateTask: () => void;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({
  users,
  tasks,
  onSelectTab,
  onSelectDepartment,
  onOpenCreateTask,
}) => {
  const approvedEmployees = users.filter((u) => u.status === 'active');
  const pendingRegistrations = users.filter((u) => u.status === 'pending_approval');

  const now = new Date();
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'Completed' && new Date(t.deadline) < now).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Department breakdowns
  const departments: Department[] = ['Coding', 'Sales', 'HR'];
  const departmentStats = departments.map((dept) => {
    const deptMembers = approvedEmployees.filter((u) => u.department === dept);
    const deptTasks = tasks.filter((t) => t.department === dept);
    const deptCompleted = deptTasks.filter((t) => t.status === 'Completed').length;
    const deptRate = deptTasks.length > 0 ? Math.round((deptCompleted / deptTasks.length) * 100) : 0;
    return {
      department: dept,
      membersCount: deptMembers.length,
      tasksCount: deptTasks.length,
      completedCount: deptCompleted,
      completionRate: deptRate,
    };
  });

  const urgentOrBlockedTasks = tasks.filter(
    (t) => t.status === 'Blocked' || (t.status !== 'Completed' && (t.priority === 'Urgent' || new Date(t.deadline) < now))
  );

  return (
    <div>
      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Approved Employees
            </span>
            <UserCheck size={18} color="var(--gold)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--hd)', color: 'var(--tx-heading)' }}>
            {approvedEmployees.length}
          </div>
          <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>Organization-wide</span>
        </div>

        <div
          className="card card-interactive"
          style={{
            padding: 20,
            borderColor: pendingRegistrations.length > 0 ? 'var(--gold-border)' : 'var(--line)',
            background: pendingRegistrations.length > 0 ? 'rgba(201, 184, 160, 0.05)' : 'var(--bg-card)',
          }}
          onClick={() => onSelectTab('employees')}
          title="Click to review pending applications"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Registrations
            </span>
            <Users size={18} color="var(--warning)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--hd)', color: pendingRegistrations.length > 0 ? 'var(--warning)' : 'var(--tx-heading)' }}>
            {pendingRegistrations.length}
          </div>
          <span style={{ fontSize: 12, color: pendingRegistrations.length > 0 ? 'var(--warning)' : 'var(--tx-muted)' }}>
            {pendingRegistrations.length > 0 ? 'Action required →' : 'All clear'}
          </span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Tasks
            </span>
            <ListTodo size={18} color="var(--blue)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--hd)', color: 'var(--tx-heading)' }}>
            {totalTasks}
          </div>
          <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>Across 3 departments</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              In Progress
            </span>
            <Clock size={18} color="var(--blue)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--hd)', color: 'var(--blue)' }}>
            {inProgressTasks}
          </div>
          <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>Active development</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Completed Tasks
            </span>
            <CheckCircle2 size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--hd)', color: 'var(--success)' }}>
            {completedTasks}
          </div>
          <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>{completionRate}% success velocity</span>
        </div>

        <div
          className="card"
          style={{
            padding: 20,
            borderColor: overdueTasks > 0 ? 'var(--danger-border)' : 'var(--line)',
            background: overdueTasks > 0 ? 'rgba(248, 113, 113, 0.05)' : 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overdue Tasks
            </span>
            <AlertTriangle size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--hd)', color: overdueTasks > 0 ? 'var(--danger)' : 'var(--tx-heading)' }}>
            {overdueTasks}
          </div>
          <span style={{ fontSize: 12, color: overdueTasks > 0 ? 'var(--danger)' : 'var(--tx-muted)' }}>
            {overdueTasks > 0 ? 'Exceeded deadline' : 'Zero overdue items'}
          </span>
        </div>
      </div>

      {/* Department Breakdown Section */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, color: 'var(--tx-heading)', marginBottom: 2 }}>
              Departmental Operations
            </h2>
            <p style={{ fontSize: 13, color: 'var(--tx-muted)', margin: 0 }}>
              Workforce distribution and task delivery rates across Sales, Coding, and HR
            </p>
          </div>
          <button type="button" className="btn btn-solid btn-sm" onClick={onOpenCreateTask}>
            + Create New Task
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {departmentStats.map((dept) => (
            <div
              key={dept.department}
              className="card card-interactive"
              onClick={() => {
                onSelectDepartment(dept.department);
                onSelectTab('departments');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)',
                    }}
                  >
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, color: 'var(--tx-heading)' }}>{dept.department}</h3>
                    <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>
                      {dept.membersCount} Team {dept.membersCount === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>
                </div>
                <span className="badge badge-department">{dept.completionRate}% Done</span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--line)',
                  overflow: 'hidden',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: `${dept.completionRate}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%)',
                    borderRadius: 999,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--tx-muted)' }}>
                <span>{dept.tasksCount} Assigned Tasks</span>
                <span style={{ color: 'var(--gold-light)', fontWeight: 500 }}>
                  {dept.completedCount} Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent & Attention Items */}
      {urgentOrBlockedTasks.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={18} color="var(--warning)" />
            <h2 style={{ fontSize: 18, color: 'var(--tx-heading)' }}>
              Items Requiring Attention ({urgentOrBlockedTasks.length})
            </h2>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--line)', color: 'var(--tx-muted)', fontSize: 12 }}>
                    <th style={{ padding: '12px 18px' }}>Task Title</th>
                    <th style={{ padding: '12px 18px' }}>Department</th>
                    <th style={{ padding: '12px 18px' }}>Assignee</th>
                    <th style={{ padding: '12px 18px' }}>Priority</th>
                    <th style={{ padding: '12px 18px' }}>Status</th>
                    <th style={{ padding: '12px 18px' }}>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {urgentOrBlockedTasks.map((t) => {
                    const isOverdue = new Date(t.deadline) < now && t.status !== 'Completed';
                    return (
                      <tr
                        key={t.id}
                        style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.2s' }}
                      >
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--tx-heading)', marginBottom: 2 }}>
                            {t.title}
                          </div>
                          {t.blockReason && (
                            <span style={{ fontSize: 12, color: 'var(--danger)', display: 'block' }}>
                              ⚠️ Blocker: {t.blockReason}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span className="badge badge-department">{t.department}</span>
                        </td>
                        <td style={{ padding: '14px 18px', color: 'var(--tx)' }}>{t.assigneeName}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <PriorityBadge priority={t.priority} />
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <StatusBadge status={t.status} />
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ color: isOverdue ? 'var(--danger)' : 'var(--tx)', fontWeight: isOverdue ? 600 : 400 }}>
                            {new Date(t.deadline).toLocaleDateString()}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
