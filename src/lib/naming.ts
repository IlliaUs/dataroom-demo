export function getUniqueName(name: string, existingNames: string[]): string {
  if (!existingNames.includes(name)) return name;

  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex === -1 ? name : name.slice(0, dotIndex);
  const ext = dotIndex === -1 ? "" : name.slice(dotIndex);

  let counter = 1;
  let candidate = `${base} (${counter})${ext}`;

  const set = new Set(existingNames);
  while (set.has(candidate)) {
    counter += 1;
    candidate = `${base} (${counter})${ext}`;
  }

  return candidate;
}

export function getExtension(name: string): string | null {
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) {
    return null;
  }
  return name.slice(lastDot + 1).toLowerCase();
}

export function hasSameExtension(oldName: string, newName: string): boolean {
  const oldExt = getExtension(oldName);
  const newExt = getExtension(newName);

  if (!oldExt) return true;

  if (!newExt || newExt !== oldExt) {
    return false;
  }

  return true;
}
