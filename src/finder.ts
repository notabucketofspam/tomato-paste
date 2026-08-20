import fs from 'node:fs';
import path from 'node:path';

export function findAudioFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filePaths: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);        
    if (entry.isDirectory()) {
      // gotta loop
      const nestedFiles = findAudioFiles(fullPath);
      filePaths.push(...nestedFiles);
    } else if (entry.isFile() && (fullPath.endsWith('.wav') || fullPath.endsWith('.ogg'))) {
      // this one's a legit file
      filePaths.push(fullPath);
    } else {
      // skip it
    }
  }
  return filePaths;
}

export function findAllFiles(dir: string, extension:string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filePaths: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);        
    if (entry.isDirectory()) {
      // gotta loop
      const nestedFiles = findAllFiles(fullPath, extension);
      filePaths.push(...nestedFiles);
    } else if (entry.isFile() && fullPath.endsWith(extension)) {
      filePaths.push(fullPath);
    } else {}
  }
  return filePaths;
}
