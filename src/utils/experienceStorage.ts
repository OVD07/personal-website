import { ExperienceCompany, ExperienceDesign } from '../types';
import { INITIAL_COMPANIES, INITIAL_EXPERIENCE_DESIGNS } from '../data/companyExperiences';

const DESIGNS_KEY = 'odunayo_experience_designs_v5_scratch';
const COMPANIES_KEY = 'odunayo_experience_companies_v5';
const SCRATCH_VERSION_KEY = 'odunayo_experience_scratch_initialized_v5';

// Dedicated IndexedDB for quota-safe storage of experience designs & companies
const EXP_DB_NAME = 'OdunayoExperienceDB';
const EXP_DB_VERSION = 1;
const EXP_DESIGNS_STORE = 'designs';
const EXP_COMPANIES_STORE = 'companies';

// In-memory cache to guarantee synchronous access without quota limitations
let memoryDesignsCache: ExperienceDesign[] | null = null;
let memoryCompaniesCache: ExperienceCompany[] | null = null;

export function updateMemoryDesignsCache(designs: ExperienceDesign[]): void {
  memoryDesignsCache = designs;
}

export function updateMemoryCompaniesCache(companies: ExperienceCompany[]): void {
  memoryCompaniesCache = companies;
}

function openExperienceDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(EXP_DB_NAME, EXP_DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(EXP_DESIGNS_STORE)) {
        db.createObjectStore(EXP_DESIGNS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(EXP_COMPANIES_STORE)) {
        db.createObjectStore(EXP_COMPANIES_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function persistDesignsToIndexedDB(designs: ExperienceDesign[]): Promise<void> {
  try {
    const db = await openExperienceDB();
    const tx = db.transaction(EXP_DESIGNS_STORE, 'readwrite');
    const store = tx.objectStore(EXP_DESIGNS_STORE);
    store.clear();
    for (const d of designs) {
      store.put(d);
    }
  } catch (err) {
    console.warn('Failed to persist designs to IndexedDB:', err);
  }
}

export async function loadDesignsFromIndexedDB(): Promise<ExperienceDesign[] | null> {
  try {
    const db = await openExperienceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(EXP_DESIGNS_STORE, 'readonly');
      const store = tx.objectStore(EXP_DESIGNS_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result as ExperienceDesign[];
        if (results && Array.isArray(results)) {
          resolve(results);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function persistCompaniesToIndexedDB(companies: ExperienceCompany[]): Promise<void> {
  try {
    const db = await openExperienceDB();
    const tx = db.transaction(EXP_COMPANIES_STORE, 'readwrite');
    const store = tx.objectStore(EXP_COMPANIES_STORE);
    store.clear();
    for (const c of companies) {
      store.put(c);
    }
  } catch (err) {
    console.warn('Failed to persist companies to IndexedDB:', err);
  }
}

export async function loadCompaniesFromIndexedDB(): Promise<ExperienceCompany[] | null> {
  try {
    const db = await openExperienceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(EXP_COMPANIES_STORE, 'readonly');
      const store = tx.objectStore(EXP_COMPANIES_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result as ExperienceCompany[];
        if (results && Array.isArray(results) && results.length > 0) {
          resolve(results);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Purge any legacy mock placeholder designs
function ensureCleanScratchState() {
  if (typeof window === 'undefined') return;
  try {
    const initialized = localStorage.getItem(SCRATCH_VERSION_KEY);
    if (!initialized) {
      // Clear any legacy mock keys from prior versions
      localStorage.removeItem('odunayo_experience_designs_v2');
      localStorage.removeItem('odunayo_experience_designs_v3');
      localStorage.removeItem('odunayo_experience_designs_v4');
      localStorage.setItem(DESIGNS_KEY, JSON.stringify([]));
      
      // Initialize companies with updated defaults
      const existingCompaniesRaw = localStorage.getItem('odunayo_experience_companies_v2');
      if (!existingCompaniesRaw) {
        localStorage.setItem(COMPANIES_KEY, JSON.stringify(INITIAL_COMPANIES));
      } else {
        try {
          const parsed = JSON.parse(existingCompaniesRaw);
          // Preserve any custom user customizations while updating labels
          const merged = INITIAL_COMPANIES.map((initComp) => {
            const match = parsed.find((p: ExperienceCompany) => p.id === initComp.id);
            return match ? { ...initComp, ...match } : initComp;
          });
          localStorage.setItem(COMPANIES_KEY, JSON.stringify(merged));
        } catch {
          localStorage.setItem(COMPANIES_KEY, JSON.stringify(INITIAL_COMPANIES));
        }
      }
      localStorage.setItem(SCRATCH_VERSION_KEY, 'true');
    }
  } catch (err) {
    console.warn('Error during scratch state check:', err);
  }
}

export function getStoredCompanies(): ExperienceCompany[] {
  ensureCleanScratchState();
  if (memoryCompaniesCache && memoryCompaniesCache.length > 0) {
    return memoryCompaniesCache;
  }
  if (typeof window === 'undefined') return INITIAL_COMPANIES;
  try {
    const raw = localStorage.getItem(COMPANIES_KEY);
    if (!raw) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(INITIAL_COMPANIES));
      memoryCompaniesCache = INITIAL_COMPANIES;
      return INITIAL_COMPANIES;
    }
    const parsed: ExperienceCompany[] = JSON.parse(raw);
    const normalized = parsed.map((comp) => {
      const init = INITIAL_COMPANIES.find((c) => c.id === comp.id);
      return {
        ...init,
        ...comp,
        logoBg: comp.logoBg || init?.logoBg || 'white',
        logoKey: comp.logoKey || init?.logoKey || (comp.id === 'megasub' ? 'megasub' : 'freelance'),
        customIconUrl: comp.customIconUrl || '',
        iconType: comp.iconType || (comp.customIconUrl ? 'custom' : 'preset'),
      };
    });
    memoryCompaniesCache = normalized;
    return normalized;
  } catch {
    return INITIAL_COMPANIES;
  }
}

export function saveStoredCompany(
  company: ExperienceCompany,
  currentCompanies?: ExperienceCompany[]
): ExperienceCompany[] {
  const current = currentCompanies && currentCompanies.length > 0
    ? currentCompanies
    : (memoryCompaniesCache || getStoredCompanies());
  const idx = current.findIndex((c) => c.id === company.id);
  let updated: ExperienceCompany[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = company;
  } else {
    updated = [company, ...current];
  }
  memoryCompaniesCache = updated;
  persistCompaniesToIndexedDB(updated);
  try {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save company to localStorage', err);
  }
  return updated;
}

export function getStoredExperienceDesigns(experienceId?: string): ExperienceDesign[] {
  if (memoryDesignsCache !== null) {
    if (experienceId) {
      return memoryDesignsCache.filter((d) => d.experienceId === experienceId);
    }
    return memoryDesignsCache;
  }

  if (typeof window === 'undefined') {
    if (experienceId) {
      return INITIAL_EXPERIENCE_DESIGNS.filter((d) => d.experienceId === experienceId);
    }
    return INITIAL_EXPERIENCE_DESIGNS;
  }
  try {
    const raw = localStorage.getItem(DESIGNS_KEY);
    let all: ExperienceDesign[];
    if (!raw) {
      localStorage.setItem(DESIGNS_KEY, JSON.stringify(INITIAL_EXPERIENCE_DESIGNS));
      all = INITIAL_EXPERIENCE_DESIGNS;
    } else {
      const parsed: ExperienceDesign[] = JSON.parse(raw);
      // Ensure all designs have a valid images array
      all = parsed.map((d) => ({
        ...d,
        images: d.images && d.images.length > 0 ? d.images : d.imageUrl ? [d.imageUrl] : [],
      }));
    }
    memoryDesignsCache = all;
    if (experienceId) {
      return all.filter((d) => d.experienceId === experienceId);
    }
    return all;
  } catch {
    if (experienceId) {
      return INITIAL_EXPERIENCE_DESIGNS.filter((d) => d.experienceId === experienceId);
    }
    return INITIAL_EXPERIENCE_DESIGNS;
  }
}

export function saveStoredExperienceDesign(
  design: ExperienceDesign,
  currentDesigns?: ExperienceDesign[]
): ExperienceDesign[] {
  // CRITICAL: Always use current in-memory designs if provided, or memory cache, or storage.
  // Never wipe out or displace previous designs!
  const baseList =
    currentDesigns && currentDesigns.length > 0
      ? currentDesigns
      : memoryDesignsCache && memoryDesignsCache.length > 0
      ? memoryDesignsCache
      : getStoredExperienceDesigns();

  const idx = baseList.findIndex((d) => d.id === design.id);
  let updated: ExperienceDesign[];
  if (idx >= 0) {
    // Updating existing design by ID
    updated = [...baseList];
    updated[idx] = design;
  } else {
    // New design: prepend to list without displacing any existing items!
    updated = [design, ...baseList];
  }

  // Update in-memory cache immediately
  memoryDesignsCache = updated;

  // Persist to IndexedDB (asynchronous & quota-safe for large images)
  persistDesignsToIndexedDB(updated);

  // Try persisting to localStorage with graceful fallback
  try {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage quota limit reached; design safely preserved in memory and IndexedDB.', err);
    try {
      // Lightweight fallback to avoid total localStorage failure
      const lightweight = updated.map((d) => ({
        ...d,
        imageUrl: d.imageUrl?.slice(0, 100) || '',
        images: (d.images || []).slice(0, 1).map((img) => img.slice(0, 100)),
      }));
      localStorage.setItem(DESIGNS_KEY, JSON.stringify(lightweight));
    } catch {
      // Ignore if localStorage completely full; IndexedDB handles persistence
    }
  }

  return updated;
}

export function deleteStoredExperienceDesign(
  designId: string,
  currentDesigns?: ExperienceDesign[]
): ExperienceDesign[] {
  const baseList =
    currentDesigns && currentDesigns.length > 0
      ? currentDesigns
      : memoryDesignsCache || getStoredExperienceDesigns();

  const updated = baseList.filter((d) => d.id !== designId);
  memoryDesignsCache = updated;
  persistDesignsToIndexedDB(updated);

  try {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to delete design from localStorage', err);
  }
  return updated;
}

export function clearAllStoredDesigns(
  experienceId?: string,
  currentDesigns?: ExperienceDesign[]
): ExperienceDesign[] {
  const baseList =
    currentDesigns && currentDesigns.length > 0
      ? currentDesigns
      : memoryDesignsCache || getStoredExperienceDesigns();

  let updated: ExperienceDesign[] = [];
  if (experienceId) {
    updated = baseList.filter((d) => d.experienceId !== experienceId);
  } else {
    updated = [];
  }
  memoryDesignsCache = updated;
  persistDesignsToIndexedDB(updated);
  try {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to clear designs from localStorage', err);
  }
  return updated;
}

export function resetCompanyToDefault(companyId: string): ExperienceCompany[] {
  const initComp = INITIAL_COMPANIES.find((c) => c.id === companyId);
  if (!initComp) return getStoredCompanies();
  return saveStoredCompany(initComp);
}

export function optimizeImageFile(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // For SVG files, preserve vector format without rasterizing
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to parse SVG file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result;
      if (typeof resultStr !== 'string') {
        reject(new Error('Invalid image result'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(resultStr);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP compression first (smaller payload, preserves quality & transparency)
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // Fallback to JPEG below
        }

        // JPEG fallback for standard compression
        try {
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(resultStr);
        }
      };
      img.onerror = () => resolve(resultStr);
      img.src = resultStr;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return optimizeImageFile(file);
}

export async function readMultipleFilesAsDataUrls(
  files: FileList | File[],
  onProgress?: (loaded: number, total: number) => void
): Promise<string[]> {
  const fileArray = Array.from(files);
  const results: string[] = [];
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    if (file.type.startsWith('image/')) {
      const dataUrl = await optimizeImageFile(file);
      results.push(dataUrl);
    }
    if (onProgress) {
      onProgress(i + 1, fileArray.length);
    }
  }
  return results;
}
