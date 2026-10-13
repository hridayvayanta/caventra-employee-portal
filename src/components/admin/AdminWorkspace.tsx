import React, { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, ListTodo, History, Plus } from 'lucide-react';
import { User, Task, ActivityEvent, Department } from '../../types';
import { CompanyOverview } from './CompanyOverview';
import { EmployeeManagement } from './EmployeeManagement';
import { DepartmentManagement } from './DepartmentManagement';
import { TaskManagement } from './TaskManagement';
import { ActivityFeed } from './ActivityFeed';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';

interface AdminWorkspaceProps {
  users: User[];
  tasks: Task[];
  activity: ActivityEvent[];
  onRefresh: () => void;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  users,
  tasks,
  activity,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'departments' | 'tasks' | 'activity'>('overview');
  const [selectedDeptForView, setSelectedDeptForView] = useState<Department>('Coding');

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskDept, setCreateTaskDept] = useState<Department>('Coding');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);

  const pendingCount = users.filter((u) => u.status === 'pending_approval').length;

  const handleOpenCreateForDept = (dept: Department) => {
    setCreateTaskDept(dept);
    setIsCreateTaskOpen(true);
  };

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* Workspace Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 28,
          borderBottom: '1px solid var(--line)',
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-solid' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={15} />
            Company Overview
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'employees' ? 'btn-solid' : 'btn-secondary'}`}
            onClick={() => setActiveTab('employees')}
            style={{ position: 'relative' }}
          >
            <Users size={15} />
            <span>Employee Management</span>
            {pendingCount > 0 && (
              <span
                style={{
                  background: 'var(--warning)',
                  color: '#121212',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 999,
                  marginLeft: 4,
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'departments' ? 'btn-solid' : 'btn-secondary'}`}
            onClick={() => setActiveTab('departments')}
          >
            <Briefcase size={15} />
            Department Management
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'tasks' ? 'btn-solid' : 'btn-secondary'}`}
            onClick={() => setActiveTab('tasks')}
          >
            <ListTodo size={15} />
            Task Management
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'activity' ? 'btn-solid' : 'btn-secondary'}`}
            onClick={() => setActiveTab('activity')}
          >
            <History size={15} />
            Activity Overview
          </button>
        </div>

        <button
          type="button"
          className="btn btn-solid btn-sm"
          onClick={() => {
            setCreateTaskDept('Coding');
            setIsCreateTaskOpen(true);
          }}
        >
          <Plus size={15} />
          Create Task
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <CompanyOverview
          users={users}
          tasks={tasks}
          onSelectTab={(tab) => setActiveTab(tab as any)}
          onSelectDepartment={(dept) => setSelectedDeptForView(dept)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        />
      )}

      {activeTab === 'employees' && (
        <EmployeeManagement users={users} onRefresh={onRefresh} />
      )}

      {activeTab === 'departments' && (
        <DepartmentManagement
          users={users}
          tasks={tasks}
          initialDepartment={selectedDeptForView}
          onOpenCreateTaskForDept={handleOpenCreateForDept}
          onSelectTask={(task) => setSelectedTaskForDetail(task)}
        />
      )}

      {activeTab === 'tasks' && (
        <TaskManagement
          tasks={tasks}
          users={users}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          onSelectTask={(task) => setSelectedTaskForDetail(task)}
          onRefresh={onRefresh}
        />
      )}

      {activeTab === 'activity' && <ActivityFeed activity={activity} />}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        users={users}
        defaultDepartment={createTaskDept}
        onTaskCreated={() => onRefresh()}
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
