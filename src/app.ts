import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

// 3. Recursively scans a directory for audio files
async function findAudioFiles(dir: string): Promise<string[]> {
    // withFileTypes: true allows us to check if an item is a folder or a file
    const entries = await readdir(dir, { withFileTypes: true });
    const filePaths: string[] = [];

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
            // If it's a folder, run this function again to dig inside it
            const nestedFiles = await findAudioFiles(fullPath);
            filePaths.push(...nestedFiles);
        } else if (entry.isFile() && (fullPath.endsWith('.wav') || fullPath.endsWith('.ogg'))) {
            // If it's a file and ends in .wav or .ogg, add it to our list
            filePaths.push(fullPath);
        }
    }

    return filePaths;
}

import {runFilediver} from './audio_extract.js';
import {transcribeWithExe} from './whisperish.js';

// 4. The main pipeline runner
async function runPipeline() {
    const extractedFolder = './extracted_audio'; // Change this to your filediver output path

    console.log(`Running filediver to extract audio to ${extractedFolder}...`);
    await runFilediver(extractedFolder);

    console.log(`Scanning ${extractedFolder} for audio files...`);
    
    try {
        // Get an array of every .wav and .ogg file in the directory
        const allAudioFiles = await findAudioFiles(extractedFolder);
        console.log(`Found ${allAudioFiles.length} audio files. Starting AI transcription... \n`);

        // Loop through each file one by one
        for (const file of allAudioFiles) {
            await transcribeWithExe(file);
        }

        console.log("\nPipeline finished successfully!");

    } catch (error) {
        console.error("Pipeline failed:", error);
    }
}

// Execute the script
runPipeline();
