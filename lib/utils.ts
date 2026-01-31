import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('hotdog_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('hotdog_session_id', sessionId);
  }
  return sessionId;
}
