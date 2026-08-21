import fs from 'node:fs';
import path from 'node:path';

import {runFilediver} from './audio_extract.js';
import {processAudio} from './whisperish.js';
import {Spelldivers2} from './speller.js';
import {runFFmpeg} from './ffmpeg.js';
import {syncBucket} from './object_storage.js';
import {findAllFiles, astext} from './finder.js';
import {writeOutJson} from './json_man.js';

import {
  extracted_audio,
  transcripts,
  final_final,
  opodes_out,
  RUN_FILEDIVER,
  RUN_TRANSCRIPTS,
  RUN_SPELLCHECKING,
  RUN_FFMPEG,
  RUN_OSYNC,
} from './config_file.js';

async function runPipeline() {

  if (RUN_FILEDIVER){
    console.log(`Using filediver to extract audio to: ${extracted_audio}... this may take a while.`);
    // filediver will overwrite old files automatically,
    // so we just gotta make sure that the folder exists
    fs.mkdirSync(extracted_audio, { recursive: true });
    runFilediver(extracted_audio);
  }
    
  const allAudioFiles = findAllFiles(extracted_audio, '.wav');

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
    console.log(`renaming/copying files to the ${final_final} folder...`);
    // get rid of the old folder, because it'll create naming conflicts otherwise
    fs.rmSync(final_final, { recursive: true, force: true });
    fs.mkdirSync(final_final, { recursive: true });
    // actually check the spells
    Spelldivers2();
  }

  const allFinalFinals = findAllFiles(final_final, '.wav');

  // convert it to opodes
  if (RUN_FFMPEG) {
    console.log('converting to opodes');
    // remove old opodes
    fs.mkdirSync(opodes_out, { recursive: true });
    // do the conversion
    await runFFmpeg(allFinalFinals);

    // delete orphans in opodes_out
    const allOpodesOut = findAllFiles(opodes_out, '.opus');
    const finalFinalSet = new Set(allFinalFinals.map(f => path.parse(f).name));
    const orphans = allOpodesOut.filter(f => !finalFinalSet.has(path.parse(f).name));
    if (orphans.length > 0) {
      // gotta delete orphans
      console.log(`Deleting ${orphans.length} orphaned opodes...`);
      for (const orphan of orphans) {
        fs.unlinkSync(orphan);
      }
    }

    // and now we have to make a new json file
    console.log('writing out new ListObjects.json...');
    writeOutJson();
  }

  // do the syncing
  if (RUN_OSYNC){
    console.log('syncing to bucket...');
    await syncBucket(opodes_out);
  }
}

// Execute the script
runPipeline();

