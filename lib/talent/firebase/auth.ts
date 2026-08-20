/**
 * Mock Firebase Auth layer locked strictly to Job Seeker role.
 * Client-side auth state matching Firebase SDK interfaces.
 */

import { User, Role } from '@/types/talent';

const STORAGE_KEY = 'skillforge_session';

const MOCK_USER: User = {
  uid: 'user-001',
  email: 'alex@skillforge.io',
  displayName: 'Alex Rivera',
  title: 'Robotics & Embedded Software Engineer',
  location: 'Boston, MA (Open to Remote)',
  photoURL: undefined,
  role: 'job_seeker',
  skills: ['ROS2', 'C++', 'Python', 'LIDAR', 'Embedded C', 'React', 'TypeScript'],
  bio: 'Passionate robotics software engineer with 3+ years experience building autonomous systems, sensor fusion pipelines, and hardware drivers.',
  githubUrl: 'https://github.com/alexrivera-robotics',
  portfolioUrl: 'https://alexrivera.dev',
  resumeFileName: 'Alex_Rivera_Robotics_Resume_2026.pdf',
  createdAt: '2024-01-15T08:00:00Z',
};

type AuthListener = (user: User | null) => void;
const listeners: Set<AuthListener> = new Set();

function notifyListeners(user: User | null) {
  listeners.forEach((fn) => fn(user));
}

function loadSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : MOCK_USER;
  } catch {
    return MOCK_USER;
  }
}

function saveSession(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

let _currentUser: User | null = null;

export function initAuth(): User | null {
  _currentUser = loadSession() || MOCK_USER;
  saveSession(_currentUser);
  return _currentUser;
}

export function onAuthStateChanged(callback: AuthListener): () => void {
  listeners.add(callback);
  callback(_currentUser || MOCK_USER);
  return () => listeners.delete(callback);
}

export function getCurrentUser(): User | null {
  return _currentUser || MOCK_USER;
}

export async function signInWithEmailAndPassword(
  email: string,
  _password: string
): Promise<User> {
  await delay(400);
  const user = { ...MOCK_USER, email: email || MOCK_USER.email };
  _currentUser = user;
  saveSession(user);
  notifyListeners(user);
  return user;
}

export async function createUserWithEmailAndPassword(
  email: string,
  _password: string,
  displayName: string,
  _role: Role = 'job_seeker'
): Promise<User> {
  await delay(500);
  const newUser: User = {
    ...MOCK_USER,
    uid: `user-${Date.now()}`,
    email,
    displayName: displayName || 'Alex Rivera',
    role: 'job_seeker',
  };
  _currentUser = newUser;
  saveSession(newUser);
  notifyListeners(newUser);
  return newUser;
}

export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  await delay(300);
  if (!_currentUser) _currentUser = MOCK_USER;
  const updated = { ..._currentUser, ...updates, role: 'job_seeker' as const };
  _currentUser = updated;
  saveSession(updated);
  notifyListeners(updated);
  return updated;
}

export async function signOut(): Promise<void> {
  await delay(200);
  _currentUser = null;
  saveSession(null);
  notifyListeners(null);
}

export async function devSetUser(preset: 'job_seeker' | 'logged_out'): Promise<void> {
  await delay(100);
  if (preset === 'logged_out') {
    _currentUser = null;
    saveSession(null);
    notifyListeners(null);
    return;
  }
  _currentUser = MOCK_USER;
  saveSession(MOCK_USER);
  notifyListeners(MOCK_USER);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}