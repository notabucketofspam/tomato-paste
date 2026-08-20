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
import {runFFmpeg} from './ffmpeg.js';
import {syncBucket} from './object_storage.js';

import {
  extracted_audio,
  transcripts,
  final_final,
  opodes_out
} from './config_file.js';

/**enable this to do the file extract from Helldivers(TM) 2*/
const RUN_FILEDIVER = false;

/**the actual AI transcript thing */
const RUN_TRANSCRIPTS = false;

/**check his spelling*/
const RUN_SPELLCHECKING = false;

/**convert the .wav files to .opus files*/
const RUN_FFMPEG = false;

/**sync to bucket*/
const RUN_OSYNC = true;

async function runPipeline() {

  if (RUN_FILEDIVER){
    console.log(`Using filediver to extract audio to: ${extracted_audio}... this may take a while.`);
    // filediver will overwrite old files automatically,
    // so we just gotta make sure that the folder exists
    fs.mkdirSync(extracted_audio, { recursive: true });
    runFilediver(extracted_audio);
  }
    
  const allAudioFiles = findAudioFiles(extracted_audio);

  console.log(`how many audio files: ${allAudioFiles.length}`);

  // Loop through each file one by one
  if (RUN_TRANSCRIPTS) {
    console.log('Starting AI transcription...  this will also take a while lol');
    fs.mkdirSync(transcripts, { recursive: true });
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

  const allFinalFinals = findAudioFiles(final_final);

  // convert it to opodes
  if (RUN_FFMPEG) {
    console.log('converting to opodes');
    // remove old opodes
    fs.rmSync(opodes_out, { recursive: true, force: true });
    fs.mkdirSync(opodes_out, { recursive: true });
    // do the conversion
    await runFFmpeg(allFinalFinals);
  }

  // do the syncing
  if (RUN_OSYNC){
    console.log('syncing to bucket...');
    await syncBucket(opodes_out);
  }
}

// Execute the script
runPipeline();

