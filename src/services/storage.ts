import { User, Task, TaskUpdate, ActivityEvent, Announcement, Department, TaskStatus, Role } from '../types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_ACTIVITY, INITIAL_ANNOUNCEMENTS } from './mockData';

const STORAGE_KEYS = {
  USERS: 'caventra_portal_users_v1',
  TASKS: 'caventra_portal_tasks_v1',
  ACTIVITY: 'caventra_portal_activity_v1',
  ANNOUNCEMENTS: 'caventra_portal_announcements_v1',
  CURRENT_USER: 'caventra_portal_session_v1',
  BACKEND_CONFIG: 'caventra_portal_backend_config_v1',
};

class PortalStorageService {
  constructor() {
    this.initializeIfEmpty();
  }

  private initializeIfEmpty(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    }
  }

  // ---- Backend Configuration / Demo Status ----
  public isBackendConfigured(): boolean {
    const config = localStorage.getItem(STORAGE_KEYS.BACKEND_CONFIG);
    if (!config) return false;
    try {
      const parsed = JSON.parse(config);
      return Boolean(parsed.apiUrl && parsed.apiKey);
    } catch {
      return false;
    }
  }

  public getBackendConfig(): { apiUrl?: string; apiKey?: string } | null {
    const config = localStorage.getItem(STORAGE_KEYS.BACKEND_CONFIG);
    if (!config) return null;
    try {
      return JSON.parse(config);
    } catch {
      return null;
    }
  }

  public setBackendConfig(config: { apiUrl: string; apiKey: string } | null): void {
    if (!config) {
      localStorage.removeItem(STORAGE_KEYS.BACKEND_CONFIG);
    } else {
      localStorage.setItem(STORAGE_KEYS.BACKEND_CONFIG, JSON.stringify(config));
    }
  }

  // ---- User Management ----
  public getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  public updateUser(id: string, updates: Partial<User>, actor?: User): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index < 0) return null;

    const previous = users[index];
    const updated = { ...previous, ...updates };
    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Log corresponding activity
    if (actor) {
      if (updates.status && updates.status !== previous.status) {
        let type: any = 'employee_activated';
        let desc = `${actor.fullName} updated ${updated.fullName}'s status to ${updates.status}.`;
        if (updates.status === 'active' && previous.status === 'pending_approval') {
          type = 'employee_approved';
          desc = `${actor.fullName} approved registration for ${updated.fullName} (${updated.department}).`;
        } else if (updates.status === 'rejected') {
          type = 'employee_rejected';
          desc = `${actor.fullName} rejected application for ${updated.fullName}.`;
        } else if (updates.status === 'deactivated') {
          type = 'employee_deactivated';
          desc = `${actor.fullName} deactivated account of ${updated.fullName}.`;
        }
        this.logActivity({
          type,
          actorId: actor.id,
          actorName: actor.fullName,
          actorRole: actor.role,
          targetId: updated.id,
          targetName: updated.fullName,
          department: updated.department,
          description: desc,
        });
      } else if (updates.department && updates.department !== previous.department) {
        this.logActivity({
          type: 'department_changed',
          actorId: actor.id,
          actorName: actor.fullName,
          actorRole: actor.role,
          targetId: updated.id,
          targetName: updated.fullName,
          department: updates.department,
          description: `${actor.fullName} transferred ${updated.fullName} to ${updates.department} Department.`,
        });
      }
    }

    return updated;
  }

  public deleteUser(id: string, actor?: User): boolean {
    const users = this.getUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return false;

    const filtered = users.filter((u) => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));

    if (actor) {
      this.logActivity({
        type: 'employee_deactivated',
        actorId: actor.id,
        actorName: actor.fullName,
        actorRole: actor.role,
        targetId: id,
        targetName: target.fullName,
        department: target.department,
        description: `${actor.fullName} removed account record for ${target.fullName}.`,
      });
    }

    return true;
  }

  // ---- Task Management ----
  public getTasks(filters?: {
    department?: Department;
    assigneeId?: string;
    status?: TaskStatus;
    searchQuery?: string;
  }): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      let tasks: Task[] = data ? JSON.parse(data) : INITIAL_TASKS;

      if (filters?.department) {
        tasks = tasks.filter((t) => t.department === filters.department);
      }
      if (filters?.assigneeId) {
        tasks = tasks.filter((t) => t.assigneeId === filters.assigneeId);
      }
      if (filters?.status) {
        tasks = tasks.filter((t) => t.status === filters.status);
      }
      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        tasks = tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.assigneeName.toLowerCase().includes(q)
        );
      }
      return tasks;
    } catch {
      return INITIAL_TASKS;
    }
  }

  public getTaskById(id: string): Task | undefined {
    return this.getTasks().find((t) => t.id === id);
  }

  public createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updates'>, actor: User): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updates: [],
    };

    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    this.logActivity({
      type: 'task_created',
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      targetId: newTask.id,
      targetName: newTask.title,
      department: newTask.department,
      description: `${actor.fullName} created task "${newTask.title}" for ${newTask.assigneeName} (${newTask.department}).`,
    });

    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>, actor: User): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) return null;

    const previous = tasks[index];
    const updated = { ...previous, ...updates };
    tasks[index] = updated;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // Audit logs for key task events
    if (updates.status && updates.status !== previous.status) {
      let eventType: any = 'task_status_changed';
      if (updates.status === 'Completed') eventType = 'task_completed';
      if (updates.status === 'Blocked') eventType = 'task_blocked';

      this.logActivity({
        type: eventType,
        actorId: actor.id,
        actorName: actor.fullName,
        actorRole: actor.role,
        targetId: updated.id,
        targetName: updated.title,
        department: updated.department,
        description: `${actor.fullName} moved task "${updated.title}" from ${previous.status} to ${updates.status}.`,
      });
    }

    if (updates.assigneeId && updates.assigneeId !== previous.assigneeId) {
      this.logActivity({
        type: 'task_reassigned',
        actorId: actor.id,
        actorName: actor.fullName,
        actorRole: actor.role,
        targetId: updated.id,
        targetName: updated.title,
        department: updated.department,
        description: `${actor.fullName} reassigned task "${updated.title}" to ${updated.assigneeName}.`,
      });
    }

    if (updates.deadline && updates.deadline !== previous.deadline) {
      this.logActivity({
        type: 'deadline_changed',
        actorId: actor.id,
        actorName: actor.fullName,
        actorRole: actor.role,
        targetId: updated.id,
        targetName: updated.title,
        department: updated.department,
        description: `${actor.fullName} updated deadline for "${updated.title}" to ${new Date(updates.deadline).toLocaleDateString()}.`,
      });
    }

    return updated;
  }

  public addTaskProgress(
    taskId: string,
    updateData: {
      newStatus: TaskStatus;
      note: string;
      deliverableUrl?: string;
    },
    actor: User
  ): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index < 0) return null;

    const task = tasks[index];
    const previousStatus = task.status;

    const newUpdate: TaskUpdate = {
      id: `upd-${Date.now().toString().slice(-6)}`,
      taskId,
      authorId: actor.id,
      authorName: actor.fullName,
      authorRole: actor.role,
      previousStatus,
      newStatus: updateData.newStatus,
      note: updateData.note,
      deliverableUrl: updateData.deliverableUrl,
      timestamp: new Date().toISOString(),
    };

    task.status = updateData.newStatus;
    if (updateData.deliverableUrl) {
      task.deliverableUrl = updateData.deliverableUrl;
    }
    if (updateData.newStatus === 'Completed') {
      task.completionNotes = updateData.note;
    } else if (updateData.newStatus === 'Blocked') {
      task.blockReason = updateData.note;
    }

    task.updates.unshift(newUpdate);
    tasks[index] = task;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    this.logActivity({
      type: updateData.newStatus === 'Completed' ? 'task_completed' : 'task_note_added',
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      targetId: task.id,
      targetName: task.title,
      department: task.department,
      description: `${actor.fullName} submitted update on "${task.title}": ${updateData.note.slice(0, 90)}${updateData.note.length > 90 ? '…' : ''}`,
    });

    return task;
  }

  public deleteTask(id: string, actor: User): boolean {
    const tasks = this.getTasks();
    const target = tasks.find((t) => t.id === id);
    if (!target) return false;

    const filtered = tasks.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));

    this.logActivity({
      type: 'task_status_changed',
      actorId: actor.id,
      actorName: actor.fullName,
      actorRole: actor.role,
      targetId: id,
      targetName: target.title,
      department: target.department,
      description: `${actor.fullName} deleted task "${target.title}".`,
    });

    return true;
  }

  // ---- Activity Log ----
  public getActivity(limit: number = 50): ActivityEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      const events: ActivityEvent[] = data ? JSON.parse(data) : INITIAL_ACTIVITY;
      return events.slice(0, limit);
    } catch {
      return INITIAL_ACTIVITY;
    }
  }

  public logActivity(eventData: Omit<ActivityEvent, 'id' | 'timestamp'>): ActivityEvent {
    const events = this.getActivity(200);
    const newEvent: ActivityEvent = {
      ...eventData,
      id: `act-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(events));
    return newEvent;
  }

  // ---- Announcements ----
  public getAnnouncements(department?: Department): Announcement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      const all: Announcement[] = data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
      if (!department) return all;
      return all.filter((a) => a.department === 'All' || a.department === department);
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  }

  public createAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Announcement {
    const all = this.getAnnouncements();
    const newAnc: Announcement = {
      ...announcement,
      id: `anc-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
    };
    all.unshift(newAnc);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(all));
    return newAnc;
  }

  // ---- Session Storage ----
  public getStoredSession(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public setStoredSession(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  // ---- Data Utilities ----
  public resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITY));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }

  public exportBackup(): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        users: this.getUsers(),
        tasks: this.getTasks(),
        activity: this.getActivity(100),
        announcements: this.getAnnouncements(),
      },
      null,
      2
    );
  }
}

export const storageService = new PortalStorageService();
