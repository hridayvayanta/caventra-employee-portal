import React, { useState } from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Briefcase,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { User, Task, TaskStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { UpdateProgressModal } from './UpdateProgressModal';
import { TaskDetailModal } from '../admin/TaskDetailModal';

interface EmployeeWorkspaceProps {
  users: User[];
  tasks: Task[];
  onRefresh: () => void;
}

export const EmployeeWorkspace: React.FC<EmployeeWorkspaceProps> = ({ users, tasks, onRefresh }) => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'tasks' | 'team' | 'announcements'>('tasks');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState<Task | null>(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);

  if (!currentUser) return null;

  // Filter tasks assigned to current employee
  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id);

  const now = new Date();
  const inProgressCount = myTasks.filter((t) => t.status === 'In Progress').length;
  const todoCount = myTasks.filter((t) => t.status === 'To Do').length;
  const blockedCount = myTasks.filter((t) => t.status === 'Blocked').length;
  const completedCount = myTasks.filter((t) => t.status === 'Completed').length;
  const overdueCount = myTasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.deadline) < now
  ).length;

  const filteredTasks = myTasks.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Department teammates
  const teammates = users.filter(
    (u) => u.department === currentUser.department && u.status === 'active' && u.id !== currentUser.id
  );

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* Welcome & KPI Banner */}
      <div
        className="card"
        style={{
          marginBottom: 28,
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(20, 24, 28, 0.95) 0%, rgba(26, 32, 38, 0.85) 100%)',
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
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="badge badge-department">{currentUser.department} Department</span>
              <span style={{ fontSize: 12, color: 'var(--tx-muted)' }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', color: 'var(--tx-heading)', marginBottom: 4 }}>
              Welcome back, <span className="text-gold-gradient">{currentUser.fullName}</span>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--tx-muted)', margin: 0 }}>
              {currentUser.position} · Track your assigned milestones and log project progress updates
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'tasks' ? 'btn-solid' : 'btn-secondary'}`}
              onClick={() => setActiveTab('tasks')}
            >
              <ListTodo size={15} />
              My Tasks ({myTasks.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'team' ? 'btn-solid' : 'btn-secondary'}`}
              onClick={() => setActiveTab('team')}
            >
              <Users size={15} />
              {currentUser.department} Team
            </button>
          </div>
        </div>

        {/* Task Metric Counters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            borderTop: '1px solid var(--line)',
            paddingTop: 20,
          }}
        >
          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>Assigned</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--tx-heading)', fontFamily: 'var(--hd)' }}>
              {myTasks.length}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>In Progress</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--hd)' }}>
              {inProgressCount}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>To Do</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--warning)', fontFamily: 'var(--hd)' }}>
              {todoCount}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>Blocked</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: blockedCount > 0 ? 'var(--danger)' : 'var(--tx)', fontFamily: 'var(--hd)' }}>
              {blockedCount}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>Completed</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--hd)' }}>
              {completedCount}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>Overdue</span>
            <div style={{ fontSize: 26, fontWeight: 700, color: overdueCount > 0 ? 'var(--danger)' : 'var(--tx-muted)', fontFamily: 'var(--hd)' }}>
              {overdueCount}
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'tasks' && (
        <>
          {/* Controls: Search and Status Filters */}
          <div className="card" style={{ padding: 18, marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              {/* Search input */}
              <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search my tasks..."
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

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(['All', 'In Progress', 'To Do', 'Blocked', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    className={`btn btn-xs ${statusFilter === st ? 'btn-solid' : 'btn-secondary'}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon">
                <FileCheck2 size={24} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>No Tasks Found</h3>
              <p style={{ color: 'var(--tx-muted)', maxWidth: 440, margin: '0 auto' }}>
                {myTasks.length === 0
                  ? "You do not have any tasks assigned yet. Check back once your department lead creates milestones for you."
                  : `No tasks match the status filter "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: 18,
              }}
            >
              {filteredTasks.map((task) => {
                const isOverdue = task.status !== 'Completed' && new Date(task.deadline) < now;
                return (
                  <div
                    key={task.id}
                    className="card card-interactive"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderColor: isOverdue ? 'var(--danger-border)' : undefined,
                    }}
                    onClick={() => setSelectedTaskForDetail(task)}
                  >
                    <div>
                      {/* Card Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                        }}
                      >
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: 17,
                          color: 'var(--tx-heading)',
                          marginBottom: 8,
                          lineHeight: 1.35,
                        }}
                      >
                        {task.title}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 13,
                          color: 'var(--tx-muted)',
                          lineHeight: 1.5,
                          marginBottom: 16,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.description}
                      </p>

                      {/* Blocker alert if blocked */}
                      {task.blockReason && (
                        <div
                          style={{
                            background: 'rgba(248, 113, 113, 0.08)',
                            border: '1px solid var(--danger-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '8px 12px',
                            marginBottom: 14,
                            fontSize: 12,
                            color: 'var(--danger)',
                          }}
                        >
                          ⚠️ Blocker: {task.blockReason}
                        </div>
                      )}
                    </div>

                    {/* Card Footer & Action Buttons */}
                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 10 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          color: 'var(--tx-muted)',
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={13} />
                          <span style={{ color: isOverdue ? 'var(--danger)' : 'var(--tx)', fontWeight: isOverdue ? 600 : 400 }}>
                            Due: {new Date(task.deadline).toLocaleDateString()}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </div>
                        <span>{task.updates.length} updates logged</span>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-solid btn-sm"
                          style={{ flex: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskForUpdate(task);
                          }}
                        >
                          <Send size={13} />
                          Update Progress
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskForDetail(task);
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'team' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, color: 'var(--tx-heading)', marginBottom: 4 }}>
              {currentUser.department} Department Colleagues
            </h2>
            <p style={{ fontSize: 13, color: 'var(--tx-muted)', margin: 0 }}>
              Connect with teammates working within your functional unit
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 16,
            }}
          >
            {teammates.map((mate) => (
              <div key={mate.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'var(--blue-bg)',
                      border: '1px solid var(--blue-border)',
                      color: 'var(--blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {mate.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, color: 'var(--tx-heading)', marginBottom: 2 }}>
                      {mate.fullName}
                    </h3>
                    <div style={{ fontSize: 12.5, color: 'var(--gold-light)', marginBottom: 2 }}>
                      {mate.position}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx-muted)' }}>{mate.email}</div>
                  </div>
                </div>
                {mate.bio && (
                  <p style={{ fontSize: 12.5, color: 'var(--tx-muted)', margin: '14px 0 0', lineHeight: 1.45 }}>
                    "{mate.bio}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <UpdateProgressModal
        task={selectedTaskForUpdate}
        isOpen={Boolean(selectedTaskForUpdate)}
        onClose={() => setSelectedTaskForUpdate(null)}
        onUpdateSubmitted={() => onRefresh()}
      />

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
        users={users}
        onTaskUpdated={() => onRefresh()}
      />
    </div>
  );
};
