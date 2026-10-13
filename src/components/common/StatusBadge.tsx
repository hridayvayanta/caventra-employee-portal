import React from 'react';
import { TaskStatus, TaskPriority, UserStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus | UserStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeClass = 'badge-todo';
  let label: string = status;

  switch (status) {
    case 'To Do':
      badgeClass = 'badge-todo';
      label = 'To Do';
      break;
    case 'In Progress':
      badgeClass = 'badge-progress';
      label = 'In Progress';
      break;
    case 'Blocked':
      badgeClass = 'badge-blocked';
      label = 'Blocked';
      break;
    case 'Completed':
      badgeClass = 'badge-completed';
      label = 'Completed';
      break;
    case 'active':
      badgeClass = 'badge-completed';
      label = 'Active';
      break;
    case 'pending_approval':
      badgeClass = 'badge-todo';
      label = 'Pending Review';
      break;
    case 'deactivated':
      badgeClass = 'badge-blocked';
      label = 'Deactivated';
      break;
    case 'rejected':
      badgeClass = 'badge-blocked';
      label = 'Rejected';
      break;
    default:
      badgeClass = 'badge-department';
      break;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <span className="badge-dot" />
      <span>{label}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <span className={`priority-tag priority-${priority}`}>
      <span>●</span>
      <span>{priority}</span>
    </span>
  );
};
