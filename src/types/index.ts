export type Role = 'super_admin' | 'employee';

export type Department = 'Sales' | 'Coding' | 'HR';

export type UserDepartment = Department | 'Founders';

export type UserStatus = 'pending_approval' | 'active' | 'deactivated' | 'rejected';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Completed';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  department: UserDepartment;
  status: UserStatus;
  position: string;
  avatarUrl?: string;
  joinedAt: string;
  phone?: string;
  location?: string;
  bio?: string;
  lastLoginAt?: string;
}

export interface TaskUpdate {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  previousStatus: TaskStatus;
  newStatus: TaskStatus;
  note: string;
  deliverableUrl?: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department: Department;
  assigneeId: string;
  assigneeName: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  blockReason?: string;
  completionNotes?: string;
  deliverableUrl?: string;
  updates: TaskUpdate[];
}

export type ActivityEventType =
  | 'employee_registered'
  | 'employee_approved'
  | 'employee_rejected'
  | 'employee_deactivated'
  | 'employee_activated'
  | 'department_changed'
  | 'task_created'
  | 'task_assigned'
  | 'task_reassigned'
  | 'task_status_changed'
  | 'task_note_added'
  | 'task_completed'
  | 'task_blocked'
  | 'deadline_changed';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: ActivityEventType;
  actorId: string;
  actorName: string;
  actorRole: Role;
  targetId?: string;
  targetName?: string;
  department?: UserDepartment;
  description: string;
  metadata?: Record<string, any>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  department: 'All' | Department;
  date: string;
  priority: 'normal' | 'important';
}
