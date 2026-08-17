import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function runFilediver(outputFolder: string) {
    const toolPath = './dongles/filediver.exe';
    
    // By default, filediver detects the game install automatically.
    // We pass arguments to tell it to only extract audio to a specific folder.
    // (Run `filediver.exe --help` in your terminal to confirm the exact flags for your version)
    const args = [
      '--types','wwise_stream', 
      '--out', outputFolder, 
      '--include', 'content/audio/us/*',
      '--audio-format', 'wav'
    ];

    console.log('Spawning filediver to unpack game audio...');

    try {
        // Execute the CLI tool headless
        const { stdout, stderr } = await execFileAsync(toolPath, args);
        
        if (stderr) {
            console.warn(`Filediver logged warnings: ${stderr}`);
        }

        console.log(`Extraction complete! Log: \n${stdout}`);
        
        // At this point, the ./extracted_audio folder is populated 
        // with .wav files, ready for your Whisper AI script to process!
        
    } catch (error) {
        throw new Error(`Filediver failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

