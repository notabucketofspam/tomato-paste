import child_process from 'node:child_process';
import {filediverExePath} from './config_file.js';
export function runFilediver(outputFolder: string) {
  const toolPath = filediverExePath;
  const args = [
    '--types','wwise_stream', 
    '--out', outputFolder, 
    '--include', 'content/audio/us/*',
    '--audio-format', 'wav'
  ];

  try {
    child_process.execFileSync(toolPath, args, {stdio: 'inherit'});        
  } catch (error) {
    throw error;
  }
}

