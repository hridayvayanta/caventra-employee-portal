import React, { useState } from 'react';
import { Search, Plus, Filter, Calendar, User, Briefcase, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Task, User as UserType, Department, TaskStatus, TaskPriority } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface TaskManagementProps {
  tasks: Task[];
  users: UserType[];
  onOpenCreateTask: () => void;
  onSelectTask: (task: Task) => void;
  onRefresh: () => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  users,
  onOpenCreateTask,
  onSelectTask,
  onRefresh,
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'All' | Department>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || t.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  const handleQuickStatusChange = (task: Task, newStatus: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;

    storageService.updateTask(task.id, { status: newStatus }, currentUser);
    toast.success(`Updated "${task.title}" to ${newStatus}`);
    onRefresh();
  };

  return (
    <div>
      {/* Header and Create Button */}
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
            Company-Wide Task Management
          </h2>
          <p style={{ fontSize: 13, color: 'var(--tx-muted)', margin: 0 }}>
            Assign, schedule, and track product milestones across all departments
          </p>
        </div>

        <button type="button" className="btn btn-solid btn-sm" onClick={onOpenCreateTask}>
          <Plus size={15} />
          Create Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Filter tasks by name, description, assignee..."
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

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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

            <select
              className="form-control"
              style={{ width: 'auto', padding: '7px 28px 7px 12px', fontSize: 13 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto', padding: '7px 28px 7px 12px', fontSize: 13 }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent 🔥</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--line)', color: 'var(--tx-muted)', fontSize: 12 }}>
                <th style={{ padding: '14px 20px' }}>Task Title &amp; Details</th>
                <th style={{ padding: '14px 20px' }}>Department</th>
                <th style={{ padding: '14px 20px' }}>Assignee</th>
                <th style={{ padding: '14px 20px' }}>Priority</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Deadline</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--tx-muted)' }}>
                    No tasks found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue = task.status !== 'Completed' && new Date(task.deadline) < new Date();
                  return (
                    <tr
                      key={task.id}
                      style={{
                        borderBottom: '1px solid var(--line)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => onSelectTask(task)}
                    >
                      <td style={{ padding: '14px 20px', maxWidth: 360 }}>
                        <div style={{ fontWeight: 600, color: 'var(--tx-heading)', marginBottom: 2 }}>
                          {task.title}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            color: 'var(--tx-muted)',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {task.description}
                        </span>
                        {task.blockReason && (
                          <span style={{ fontSize: 11.5, color: 'var(--danger)', display: 'block', marginTop: 2 }}>
                            ⚠️ Blocker: {task.blockReason}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span className="badge badge-department">{task.department}</span>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ color: 'var(--tx)', fontWeight: 500 }}>{task.assigneeName}</span>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <PriorityBadge priority={task.priority} />
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={task.status} />
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ color: isOverdue ? 'var(--danger)' : 'var(--tx-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                          {new Date(task.deadline).toLocaleDateString()}
                          {isOverdue && ' (Overdue)'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                          {task.status !== 'Completed' ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              title="Mark as Completed"
                              onClick={(e) => handleQuickStatusChange(task, 'Completed', e)}
                            >
                              <CheckCircle2 size={12} color="var(--success)" />
                              Complete
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              title="Reopen Task"
                              onClick={(e) => handleQuickStatusChange(task, 'In Progress', e)}
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
