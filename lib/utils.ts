import type { ApplicationStatus, NotificationType, ProjectStatus } from '@/types/innovator';

// ─── CLASS UTILITY ────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── DATE UTILITIES ───────────────────────────────────────────

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── STATUS UTILITIES ─────────────────────────────────────────

export function getApplicationStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    Applied: 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Shortlisted: 'bg-violet-50 text-violet-700 border-violet-200',
    Interview: 'bg-orange-50 text-orange-700 border-orange-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-50 text-red-600 border-red-200',
  };
  return colors[status] || 'bg-slate-50 text-slate-600 border-slate-200';
}

export function getProjectStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Planning: 'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-slate-100 text-slate-600 border-slate-200',
    Paused: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return colors[status];
}

export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    collaboration_request: '🤝',
    collaboration_accepted: '✅',
    collaboration_declined: '❌',
    application_update: '📋',
    grant_match: '💰',
    new_connection: '🔗',
    new_message: '💬',
    project_invitation: '🚀',
    pitch_update: '📤',
  };
  return icons[type] || '🔔';
}

// ─── STRING UTILITIES ─────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ─── VALIDATION UTILITIES ─────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'At least 8 characters required' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'At least one uppercase letter required' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'At least one number required' };
  return { valid: true, message: '' };
}

// ─── FILTER UTILITIES ─────────────────────────────────────────

export function filterByQuery<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') return value.toLowerCase().includes(q);
      if (Array.isArray(value)) return value.some((v) => typeof v === 'string' && v.toLowerCase().includes(q));
      return false;
    })
  );
}
