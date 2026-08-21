import fs from 'node:fs';
import path from 'node:path';

export function findAllFiles(dir: string, extension:string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filePaths: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);        
    if (entry.isDirectory()) {
      // gotta loop
      const nestedFiles = findAllFiles(fullPath, extension);
      filePaths.push(...nestedFiles);
    } else if (entry.isFile() && path.extname(fullPath) === extension) {
      filePaths.push(fullPath);
    } else {}
  }
  return filePaths;
}

export function astext(x:string){
	return fs.readFileSync(path.normalize(x),{encoding:'utf8'});
}

