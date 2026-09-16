import { Project, PortfolioSection } from '../types';
import { DEFAULT_PROJECTS } from './defaultProjects';

const DB_NAME = 'OdunayoPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';
const LOCAL_STORAGE_KEY = 'odunayo_portfolio_projects_backup';
const CURRENT_VERSION = 'v5_clean_scratch';
const VERSION_KEY = 'odunayo_portfolio_megasub_version';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getProjects(): Promise<Project[]> {
  try {
    if (typeof window !== 'undefined') {
      const storedVer = localStorage.getItem(VERSION_KEY);
      if (storedVer !== CURRENT_VERSION) {
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        return await resetToDefaultProjects();
      }
    }
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result as Project[];
        if (!results || results.length === 0) {
          // Initialize with default projects
          initializeDefaultProjects().then(resolve);
        } else {
          // Normalize and sort by order
          const normalized = results.map((p) => {
            return {
              ...p,
              section: (p.section || 'megasub') as PortfolioSection,
              brief: p.brief || p.description || '',
            };
          });
          normalized.sort((a, b) => a.order - b.order);
          resolve(normalized);
        }
      };

      req.onerror = () => {
        fallbackGetLocalStorage(resolve);
      };
    });
  } catch {
    return new Promise((resolve) => {
      fallbackGetLocalStorage(resolve);
    });
  }
}

async function initializeDefaultProjects(): Promise<Project[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const p of DEFAULT_PROJECTS) {
      store.put(p);
    }
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    return [...DEFAULT_PROJECTS];
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    return [...DEFAULT_PROJECTS];
  }
}

export async function saveProject(project: Project): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(project);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fallback
    const current = getLocalFallbackProjects();
    const idx = current.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      current[idx] = project;
    } else {
      current.push(project);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const current = getLocalFallbackProjects().filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  }
}

export async function reorderProjects(projects: Project[]): Promise<void> {
  const updated = projects.map((p, index) => ({ ...p, order: index + 1 }));
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const p of updated) {
      store.put(p);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
}

export async function resetToDefaultProjects(): Promise<Project[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const p of DEFAULT_PROJECTS) {
      store.put(p);
    }
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
  } catch {
    // ignore
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
  return [...DEFAULT_PROJECTS];
}

function fallbackGetLocalStorage(resolve: (projects: Project[]) => void) {
  const data = getLocalFallbackProjects();
  if (!data || data.length === 0) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    resolve([...DEFAULT_PROJECTS]);
  } else {
    data.sort((a, b) => a.order - b.order);
    resolve(data);
  }
}

function getLocalFallbackProjects(): Project[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Reads an uploaded file as a high-resolution Data URL.
 * Also calculates dimensions if desired.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
