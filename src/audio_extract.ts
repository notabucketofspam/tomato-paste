import child_process from 'node:child_process';

export function runFilediver(outputFolder: string) {
  const toolPath = './dongles/filediver.exe';
  const args = [
    '--types','wwise_stream', 
    '--out', outputFolder, 
    '--include', 'content/audio/us/*',
    '--audio-format', 'wav'
  ];

  // console.log('Spawning filediver to unpack game audio...');

  try {
      // Execute the CLI tool headless
    child_process.execFileSync(toolPath, args, {stdio: 'inherit'});
        
    // if (stderr) {
    //     console.warn(`Filediver logged warnings: ${stderr}`);
    // }

    // console.log(`Extraction complete! Log: \n${stdout}`);
        
  } catch (error) {
    throw new Error(`Filediver failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

