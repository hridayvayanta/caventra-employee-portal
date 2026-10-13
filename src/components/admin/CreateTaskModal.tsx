import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, AlertCircle } from 'lucide-react';
import { User, Department, TaskPriority, TaskStatus, Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  defaultDepartment?: Department;
  onTaskCreated: (task: Task) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  users,
  defaultDepartment = 'Coding',
  onTaskCreated,
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [deadline, setDeadline] = useState('');

  // Update department if defaultDepartment changes
  useEffect(() => {
    if (defaultDepartment) {
      setDepartment(defaultDepartment);
    }
  }, [defaultDepartment]);

  // Filter eligible active employees in the selected department
  const eligibleAssignees = users.filter(
    (u) => u.department === department && u.status === 'active'
  );

  // Set default assignee when department changes
  useEffect(() => {
    if (eligibleAssignees.length > 0 && !eligibleAssignees.some((u) => u.id === assigneeId)) {
      setAssigneeId(eligibleAssignees[0].id);
    }
  }, [department, eligibleAssignees, assigneeId]);

  // Set default deadline to 5 days from now
  useEffect(() => {
    if (!deadline) {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      setDeadline(d.toISOString().slice(0, 10));
    }
  }, [deadline]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    const assignedUser = users.find((u) => u.id === assigneeId);
    if (!assignedUser) {
      toast.error('Please select an active employee to assign this task.');
      return;
    }

    const newTask = storageService.createTask(
      {
        title: title.trim(),
        description: description.trim(),
        department,
        assigneeId: assignedUser.id,
        assigneeName: assignedUser.fullName,
        createdBy: currentUser.id,
        createdByName: currentUser.fullName,
        deadline: new Date(deadline).toISOString(),
        priority,
        status,
      },
      currentUser
    );

    toast.success(`Task "${newTask.title}" created and assigned to ${newTask.assigneeName}.`);
    onTaskCreated(newTask);
    onClose();

    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-large"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h3 id="create-task-title" style={{ fontSize: 18 }}>
                Create New Caventra Task
              </h3>
              <p style={{ fontSize: 12, color: 'var(--tx-muted)', margin: 0 }}>
                Assign work packages to employees with deadlines and priorities
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
            <div className="form-group">
              <label className="form-label" htmlFor="tsk-title">
                Task Title *
              </label>
              <input
                id="tsk-title"
                type="text"
                className="form-control"
                placeholder="e.g. Architect Stripe billing webhooks for Ironforge Store"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tsk-desc">
                Task Description &amp; Scope *
              </label>
              <textarea
                id="tsk-desc"
                className="form-control"
                rows={4}
                placeholder="Detail technical deliverables, client specifications, and acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="tsk-dept">
                  Department *
                </label>
                <select
                  id="tsk-dept"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  required
                >
                  <option value="Coding">Coding</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tsk-assignee">
                  Assignee *
                </label>
                <select
                  id="tsk-assignee"
                  className="form-control"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  required
                >
                  {eligibleAssignees.length === 0 ? (
                    <option value="" disabled>
                      No active personnel in {department}
                    </option>
                  ) : (
                    eligibleAssignees.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.position})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="tsk-priority">
                  Priority Level *
                </label>
                <select
                  id="tsk-priority"
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent 🔥</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tsk-status">
                  Initial Status *
                </label>
                <select
                  id="tsk-status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  required
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tsk-deadline">
                  Target Deadline *
                </label>
                <input
                  id="tsk-deadline"
                  type="date"
                  className="form-control"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-solid btn-sm">
              <Plus size={15} />
              Create &amp; Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
