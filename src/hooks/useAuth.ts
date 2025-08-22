import { useState, useEffect } from 'react';
import { User } from '../types';

const SAMPLE_USERS: User[] = [
  { id: 'admin1', name: 'Administrator', role: 'Admin', password: 'admin123' },
  { id: 'tu1', name: 'Bagian TU', role: 'TU', password: 'tu123' },
  { id: 'coord1', name: 'Suwarti, S.H', role: 'Coordinator', password: 'coord123' },
  { id: 'coord2', name: 'Achamd Evianto', role: 'Coordinator', password: 'coord123' },
  { id: 'staff1', name: 'Budi Santoso', role: 'Staff', password: 'staff123' },
  { id: 'staff2', name: 'Sari Wijaya', role: 'Staff', password: 'staff123' }
];

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (id: string, password: string): boolean => {
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const createUser = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return {
    currentUser,
    users,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser
  };
};