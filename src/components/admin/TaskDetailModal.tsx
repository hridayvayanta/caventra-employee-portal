import React, { useState } from 'react';
import { X, Calendar, User, Briefcase, ExternalLink, Trash2, Check, Clock, AlertTriangle } from 'lucide-react';
import { Task, User as UserType, TaskStatus, TaskPriority, Department } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  onTaskUpdated: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  users,
  onTaskUpdated,
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'To Do');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'Medium');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || '');
  const [deadline, setDeadline] = useState(task ? new Date(task.deadline).toISOString().slice(0, 10) : '');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state when task prop changes
  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId);
      setDeadline(new Date(task.deadline).toISOString().slice(0, 10));
      setIsEditing(false);
    }
  }, [task]);

  if (!isOpen || !task || !currentUser) return null;

  const isSuperAdmin = currentUser.role === 'super_admin';
  const eligibleAssignees = users.filter((u) => u.department === task.department && u.status === 'active');
  const isOverdue = task.status !== 'Completed' && new Date(task.deadline) < new Date();

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = users.find((u) => u.id === assigneeId);

    const updated = storageService.updateTask(
      task.id,
      {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId,
        assigneeName: assignedUser ? assignedUser.fullName : task.assigneeName,
        deadline: new Date(deadline).toISOString(),
      },
      currentUser
    );

    if (updated) {
      toast.success('Task details updated.');
      setIsEditing(false);
      onTaskUpdated();
    }
  };

  const handleDelete = () => {
    storageService.deleteTask(task.id, currentUser);
    toast.info(`Task "${task.title}" was deleted.`);
    setShowDeleteConfirm(false);
    onTaskUpdated();
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-dialog modal-dialog-large"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-detail-title"
        >
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, paddingRight: 10 }}>
              <span className="badge badge-department">{task.department}</span>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
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

          <div className="modal-body">
            {isEditing && isSuperAdmin ? (
              <form onSubmit={handleSaveChanges}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-title">
                    Title
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-desc">
                    Description
                  </label>
                  <textarea
                    id="edit-desc"
                    className="form-control"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-assignee">
                      Reassign Employee
                    </label>
                    <select
                      id="edit-assignee"
                      className="form-control"
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                    >
                      {eligibleAssignees.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} ({u.position})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-status">
                      Status
                    </label>
                    <select
                      id="edit-status"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-priority">
                      Priority
                    </label>
                    <select
                      id="edit-priority"
                      className="form-control"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent 🔥</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-deadline">
                      Deadline
                    </label>
                    <input
                      id="edit-deadline"
                      type="date"
                      className="form-control"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button type="submit" className="btn btn-solid btn-sm">
                    <Check size={14} />
                    Save Updates
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 id="task-detail-title" style={{ fontSize: 22, color: 'var(--tx-heading)', marginBottom: 8 }}>
                  {task.title}
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    fontSize: 12.5,
                    color: 'var(--tx-muted)',
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div>
                    Assignee: <strong style={{ color: 'var(--tx)' }}>{task.assigneeName}</strong>
                  </div>
                  <div>•</div>
                  <div>
                    Created By: <span style={{ color: 'var(--tx)' }}>{task.createdByName}</span>
                  </div>
                  <div>•</div>
                  <div style={{ color: isOverdue ? 'var(--danger)' : 'var(--tx)', fontWeight: isOverdue ? 600 : 400 }}>
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                    {isOverdue && ' (Overdue)'}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--tx-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
                    Scope &amp; Description
                  </h4>
                  <p style={{ fontSize: 14.5, color: 'var(--tx)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {task.description}
                  </p>
                </div>

                {/* If Blocked, display warning callout */}
                {task.blockReason && (
                  <div
                    style={{
                      background: 'rgba(248, 113, 113, 0.08)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                      <AlertTriangle size={15} />
                      Current Blocker
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0 }}>
                      {task.blockReason}
                    </p>
                  </div>
                )}

                {/* If Deliverable URL exists */}
                {task.deliverableUrl && (
                  <div
                    style={{
                      background: 'rgba(201, 184, 160, 0.06)',
                      border: '1px solid var(--gold-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11.5, color: 'var(--tx-muted)', display: 'block' }}>Submitted Deliverable</span>
                      <span style={{ fontSize: 13, color: 'var(--gold-light)', fontWeight: 500, wordBreak: 'break-all' }}>
                        {task.deliverableUrl}
                      </span>
                    </div>
                    <a
                      href={task.deliverableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-xs"
                    >
                      <ExternalLink size={12} />
                      Open Link ↗
                    </a>
                  </div>
                )}

                {/* Progress History Updates */}
                <div>
                  <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--tx-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>
                    Work History &amp; Progress Log ({task.updates.length})
                  </h4>

                  {task.updates.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--tx-muted)', fontStyle: 'italic' }}>
                      No progress updates logged yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {task.updates.map((update) => (
                        <div
                          key={update.id}
                          style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--line)',
                            borderRadius: 'var(--radius-sm)',
                            padding: 14,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ fontSize: 13, color: 'var(--gold-light)' }}>
                                {update.authorName}
                              </strong>
                              <span style={{ fontSize: 11, color: 'var(--tx-muted)' }}>
                                ({update.authorRole === 'super_admin' ? 'Super Admin' : 'Employee'})
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--tx-muted)' }}>
                              {new Date(update.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div style={{ fontSize: 12, color: 'var(--tx-muted)', marginBottom: 6 }}>
                            Status transition: <span style={{ color: 'var(--tx)' }}>{update.previousStatus}</span> →{' '}
                            <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>{update.newStatus}</span>
                          </div>

                          <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>
                            {update.note}
                          </p>

                          {update.deliverableUrl && (
                            <div style={{ marginTop: 8 }}>
                              <a
                                href={update.deliverableUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'underline' }}
                              >
                                Deliverable Attachment ↗
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <div>
              {isSuperAdmin && !isEditing && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={14} />
                  Delete Task
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {isSuperAdmin && !isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Task Details
                </button>
              )}
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action removes all historical work updates and cannot be undone.`}
        confirmLabel="Permanently Delete"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
