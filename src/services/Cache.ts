import { safeJsonParse } from '@/utils';

export class Cache {
  static get<T = any>(key: string, def?: T): T {
    const result = safeJsonParse(localStorage.getItem(key), def);

    return result ?? def;
  }

  static set<T = any>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));

    return data;
  }

  static remove(key: string) {
    return localStorage.removeItem(key);
  }

  static clear() {
    return localStorage.clear();
  }
}

export class BaseCacheHelp {
  static readonly key: string;

  static get<T = any>(def?: any) {
    return Cache.get<T>(this.key, def);
  }

  static set<T = any>(data: any) {
    return Cache.set<T>(this.key, data);
  }

  static remove() {
    return Cache.remove(this.key);
  }

  static clear() {
    return Cache.clear();
  }
}
