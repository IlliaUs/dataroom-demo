const fileStore = new Map<string, File>();
const MAX_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB limit
let currentSize = 0;

export function saveFile(file: File): string {
  if (currentSize + file.size > MAX_STORAGE_SIZE) {
    throw new Error(
      `File too large. Storage limit (${(MAX_STORAGE_SIZE / 1024 / 1024).toFixed(0)}MB) would be exceeded.`
    );
  }

  const key = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  fileStore.set(key, file);
  currentSize += file.size;
  return key;
}

export function getFile(key: string): File | undefined {
  return fileStore.get(key);
}
