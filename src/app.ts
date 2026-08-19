import fs from 'node:fs';
import path from 'node:path';

function findAudioFiles(dir: string): string[] {
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

import {runFilediver} from './audio_extract.js';
import {processAudio} from './whisperish.js';
import {Spelldivers2} from './speller.js';

import {extracted_audio, final_final} from './config_file.js';

/**enable this to do the file extract from Helldivers(TM) 2*/
const RUN_FILEDIVER = false;

/**the actual AI transcript thing */
const RUN_TRANSCRIPTS = false;

/**check his spelling*/
const RUN_SPELLCHECKING = true;

function runPipeline() {

  if (RUN_FILEDIVER){
    console.log(`Using filediver to extract audio to: ${extracted_audio}... this may take a while.`);
    runFilediver(extracted_audio);
  }
    
  const allAudioFiles = findAudioFiles(extracted_audio);

  console.log(`how many audio files: ${allAudioFiles.length}`);

  // Loop through each file one by one
  if (RUN_TRANSCRIPTS) {
    console.log('Starting AI transcription...  this will also take a while lol');
    for (const file of allAudioFiles) {
      processAudio(file);
    }
  }
  
  // spelling
  if (RUN_SPELLCHECKING) {    
    console.log(`renaming/copying files to the final_final folder...`);
    // get rid of the old folder, because it'll create naming conflicts otherwise
    fs.rmSync(final_final, { recursive: true, force: true });
    fs.mkdirSync(final_final, { recursive: true });
    // actually check the spells
    Spelldivers2(allAudioFiles);
  }
}

// Execute the script
runPipeline();

