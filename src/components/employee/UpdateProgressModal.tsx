import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, Link as LinkIcon, Send } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

interface UpdateProgressModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSubmitted: () => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateSubmitted,
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [newStatus, setNewStatus] = useState<TaskStatus>('In Progress');
  const [note, setNote] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (task) {
      setNewStatus(task.status === 'Completed' ? 'Completed' : 'In Progress');
      setNote('');
      setDeliverableUrl(task.deliverableUrl || '');
    }
  }, [task]);

  if (!isOpen || !task || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!note.trim()) {
      toast.error('Please include a brief description of the work performed.');
      return;
    }

    setIsSubmitting(true);
    storageService.addTaskProgress(
      task.id,
      {
        newStatus,
        note: note.trim(),
        deliverableUrl: deliverableUrl.trim() || undefined,
      },
      currentUser
    );
    setIsSubmitting(false);

    toast.success(`Progress update submitted for "${task.title}".`);
    onUpdateSubmitted();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="progress-modal-title" style={{ fontSize: 18 }}>
              Submit Work Progress
            </h3>
            <p style={{ fontSize: 12, color: 'var(--tx-muted)', margin: 0 }}>
              Update status and submit milestone deliverables for review
            </p>
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
            {/* Task summary */}
            <div
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 11, color: 'var(--tx-muted)', textTransform: 'uppercase' }}>
                Assigned Task
              </span>
              <div style={{ fontWeight: 600, color: 'var(--tx-heading)', fontSize: 14, marginTop: 2 }}>
                {task.title}
              </div>
            </div>

            {/* Status selection radio pills */}
            <div className="form-group">
              <label className="form-label">Current Task Status *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${newStatus === 'In Progress' ? 'btn-solid' : 'btn-secondary'}`}
                  onClick={() => setNewStatus('In Progress')}
                  style={{ justifyContent: 'center' }}
                >
                  <Clock size={14} />
                  In Progress
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${newStatus === 'Blocked' ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => setNewStatus('Blocked')}
                  style={{ justifyContent: 'center' }}
                >
                  <AlertTriangle size={14} />
                  Blocked
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${newStatus === 'Completed' ? 'btn-solid' : 'btn-secondary'}`}
                  onClick={() => setNewStatus('Completed')}
                  style={{ justifyContent: 'center', borderColor: newStatus === 'Completed' ? 'var(--success)' : undefined }}
                >
                  <CheckCircle2 size={14} />
                  Completed
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="work-notes">
                Work Summary &amp; Progress Notes *
              </label>
              <textarea
                id="work-notes"
                className="form-control"
                rows={4}
                placeholder={
                  newStatus === 'Blocked'
                    ? 'Explain the technical blocker, missing dependencies, or assistance required...'
                    : newStatus === 'Completed'
                    ? 'Summarize final deliverables, test results, and deployment status...'
                    : 'Detail what was completed today and next steps...'
                }
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="work-deliverable">
                Deliverable Link / Documentation URL (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="work-deliverable"
                  type="url"
                  className="form-control"
                  placeholder="https://github.com/caventra/... or https://figma.com/..."
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
                <LinkIcon
                  size={15}
                  color="var(--tx-muted)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-solid btn-sm" disabled={isSubmitting}>
              <Send size={14} />
              {isSubmitting ? 'Submitting…' : 'Log Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
