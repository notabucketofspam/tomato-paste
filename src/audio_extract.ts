import child_process from 'node:child_process';

export function runFilediver(outputFolder: string) {
  const toolPath = './dongles/filediver.exe';
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

