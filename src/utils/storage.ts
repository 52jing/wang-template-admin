/**
 * 浏览器存储辅助函数
 */
import { LocalStorage, SessionStorage } from 'quasar';

export function saveLocal(key: string, data: string | number | object) {
  if (key && data) {
    try {
      LocalStorage.set(key, data);
    } catch (e) {
      console.log('save to local failed');
    }
  }
}

export function loadLocal(key: string): string | number | object | null {
  if (key && LocalStorage.has(key)) {
    return LocalStorage.getItem(key);
  }
  return null;
}

export function removeLocal(key: string) {
  if (key) {
    LocalStorage.remove(key);
  }
}

export function saveSession(key: string, data: string | number | object) {
  if (key && data) {
    try {
      SessionStorage.set(key, data);
    } catch (e) {
      console.log('save to session failed');
    }
  }
}

export function loadSession(key: string): string | number | object | null {
  if (key && SessionStorage.has(key)) {
    return SessionStorage.getItem(key);
  }
  return null;
}

export function removeSession(key: string) {
  if (key) {
    SessionStorage.remove(key);
  }
}
