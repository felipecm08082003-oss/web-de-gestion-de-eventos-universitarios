export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(c => typeof c === 'string').join(' ');
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getDaysUntilEvent(date: Date | string): number {
  const eventDate = new Date(date);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isEventSoon(date: Date | string): boolean {
  return getDaysUntilEvent(date) <= 7 && getDaysUntilEvent(date) > 0;
}

export function isEventToday(date: Date | string): boolean {
  const eventDate = new Date(date);
  const today = new Date();
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
}

export function getCapacityPercentage(asistentes: number, capacidad: number): number {
  if (capacidad === 0) return 0;
  return Math.round((asistentes / capacidad) * 100);
}

export function getCapacityStatus(percentage: number): string {
  if (percentage >= 90) return 'danger';
  if (percentage >= 70) return 'warning';
  return 'safe';
}
