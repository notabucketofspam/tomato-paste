import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

import {opodes_out, ffmpegExePath} from './config_file.js';

const execFileAsync = promisify(execFile);

async function convertAndNormalize(inputPath: string) {
  const parsedPath = path.parse(inputPath);

  // Create the new filename with the .opus extension
  const outputPath = path.join(opodes_out, `${parsedPath.name}.opus`);
  
  try {
        
    await execFileAsync(ffmpegExePath, [
      '-i', inputPath,
      '-ac', '2',
      '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11',
      '-c:a', 'libopus',
      '-b:a', '128k',
      outputPath,
      '-y'
    ]);        

  } catch (error) {
    console.error(`FFmpeg failed on ${inputPath}:`, error);
  }
}

async function mapConcurrent<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  let index = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const current = items[index++];
      if (current){
        await fn(current);
      }
    }
  });
  await Promise.all(workers);
}

export async function runFFmpeg(audioFiles: string[]){
  await mapConcurrent(audioFiles, 4, async (file) => {
    await convertAndNormalize(file);
  });
}

