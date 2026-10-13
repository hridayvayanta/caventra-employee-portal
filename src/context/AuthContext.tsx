import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Department } from '../types';
import { storageService } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  demoSwitchUser: (userId: string) => void;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    department: Department;
    position: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDemoMode = !storageService.isBackendConfigured();

  useEffect(() => {
    // Check for existing session
    const session = storageService.getStoredSession();
    if (session) {
      // Re-verify against storage to ensure status hasn't changed (e.g., deactivated/rejected)
      const freshUser = storageService.getUserById(session.id);
      if (freshUser && freshUser.status === 'active') {
        setCurrentUser(freshUser);
      } else {
        storageService.setStoredSession(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450)); // Simulating auth network delay

    const cleanEmail = email.trim().toLowerCase();
    const user = storageService.getUserByEmail(cleanEmail);

    if (!user) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No account registered with this email address. Please check your spelling or register for access.',
      };
    }

    if (user.status === 'pending_approval') {
      setIsLoading(false);
      return {
        success: false,
        error: 'Your registration is currently pending Super-Admin review. You will receive an approval notification once Caventra management confirms your role.',
      };
    }

    if (user.status === 'deactivated') {
      setIsLoading(false);
      return {
        success: false,
        error: 'This account has been deactivated. Please contact your department lead or Caventra Super-Admin.',
      };
    }

    if (user.status === 'rejected') {
      setIsLoading(false);
      return {
        success: false,
        error: 'This registration application was not approved. Please consult Caventra HR for further inquiries.',
      };
    }

    // Set updated last login timestamp
    const updated = storageService.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    const finalUser = updated || user;

    storageService.setStoredSession(finalUser);
    setCurrentUser(finalUser);
    setIsLoading(false);

    storageService.logActivity({
      type: 'task_status_changed',
      actorId: finalUser.id,
      actorName: finalUser.fullName,
      actorRole: finalUser.role,
      department: finalUser.department,
      description: `${finalUser.fullName} authenticated into ${finalUser.role === 'super_admin' ? 'Super-Admin' : 'Employee'} Workspace.`,
    });

    return { success: true };
  };

  const demoSwitchUser = (userId: string) => {
    const user = storageService.getUserById(userId);
    if (user) {
      storageService.setStoredSession(user);
      setCurrentUser(user);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    department: Department;
    position: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanEmail = data.email.trim().toLowerCase();
    const existing = storageService.getUserByEmail(cleanEmail);

    if (existing) {
      setIsLoading(false);
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in or use another email.',
      };
    }

    const newUser: User = {
      id: `usr-reg-${Date.now().toString().slice(-6)}`,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: 'employee',
      department: data.department,
      status: 'pending_approval',
      position: data.position.trim() || 'Team Member',
      joinedAt: new Date().toISOString(),
    };

    storageService.saveUser(newUser);

    storageService.logActivity({
      type: 'employee_registered',
      actorId: newUser.id,
      actorName: newUser.fullName,
      actorRole: 'employee',
      targetId: newUser.id,
      targetName: newUser.fullName,
      department: newUser.department,
      description: `New registration submitted by ${newUser.fullName} for ${newUser.department} Department. Pending approval.`,
    });

    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    storageService.setStoredSession(null);
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = storageService.updateUser(currentUser.id, updates, currentUser);
    if (updated) {
      setCurrentUser(updated);
      storageService.setStoredSession(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isDemoMode,
        login,
        demoSwitchUser,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
