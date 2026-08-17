import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';

const execFileAsync = promisify(execFile);

export async function transcribeWithExe(filePath: string) {
    const toolPath = './dongles/faster-whisper-xxl.exe';
    
    // Flags tell it to use the base model, English, enable VAD, and output a standard text file
    const args = [
        filePath,
        '--language', 'en',
        '--model', 'base',
        '--vad_filter', 'True',
        '--output_format', 'txt',
        '--beep_off',
    ];

    console.log(`Sending ${filePath} to Faster-Whisper...`);

    try {
        await execFileAsync(toolPath, args);
        
        const actualFilename = path.parse(filePath).name;

        const textFilePath = `dongles/${actualFilename}.txt`;
        
        // Read the result back into Node.js
        let transcript = await fs.promises.readFile(textFilePath, 'utf-8');
        transcript = transcript.replace(/^\[.*?\]/g, ''); // Remove timestamp
        transcript = transcript.replace(/[^\w\s]/g, ''); // Remove any punctuation
        console.log("Result:", transcript.trim());


      const parsedPath = path.parse(filePath);
      const truncatedName = transcript.substring(0, 60).trim(); 

      let newFileName = `${truncatedName}${parsedPath.ext}`;
      let newFilePath = path.join(parsedPath.dir, newFileName);
      let counter = 1;

      // Loop to check if the file already exists
      while (true) {
          try {
              // access() throws an error if the file DOES NOT exist
              await fs.promises.access(newFilePath);
        
              // If we get here, the file DOES exist. Append a number and try again.
              newFileName = `${truncatedName} (${counter})${parsedPath.ext}`;
              newFilePath = path.join(parsedPath.dir, newFileName);
              counter++;
          } catch {
              // The file doesn't exist yet! It is safe to break the loop and use this name.
              break;
          }
      }

      await fs.promises.rename(filePath, newFilePath);
        
    } catch (error) {
        //console.error("Transcription failed:", error);
        throw error;
    }
}

