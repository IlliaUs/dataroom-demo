export function isPdfFile(file: File): boolean {
  const mimeOk = file.type === "application/pdf";
  const name = file.name.toLowerCase();
  const extOk = name.endsWith(".pdf");
  return mimeOk || extOk;
}