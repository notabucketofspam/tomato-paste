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
import {hellcheck} from './speller.js';

/**enable this to do the file extract from Helldivers(TM) 2*/
const RUN_FILEDIVER = false;

/**the actual AI transcript thing */
const RUN_TRANSCRIPTS = false;

function runPipeline() {
  /**thus is the folder where filediver.exe dumps his .wav files*/
  const extracted_audio = './extracted_audio';

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

  // loop through everything in the transcripts folder, and...
  // find it in the extracted_audio/content/audio/us folder, and....
  // copy it into the final_final folder, and ...
  // rename it to be whatever is in the transcript

  console.log(`renaming/copying files to the final_final folder...`);

  /**this is the folder where all of the final (final) files go to rest*/
  const final_final = './final_final';
  fs.mkdirSync(final_final, { recursive: true });

  const spelldiver = hellcheck();

  const teaFiles = fs.readdirSync('./transcripts', { withFileTypes: true });
  for (const file of teaFiles){
    if (file.isFile() && file.name.endsWith('.txt')) {
      const maybeName = path.parse(file.name).name;
      const dudeWheresMyWavFile = allAudioFiles.find(f => path.parse(f).name === maybeName);
      if (dudeWheresMyWavFile) {
        // we actually have a wave file

        let thosBeans = fs.readFileSync(path.join('./transcripts', file.name), 'utf-8');
        //clean up the transcript
        thosBeans = thosBeans.replace(/[^\w\s]|\r|\n/gm, "").trim();

        // do the spell-checking
        thosBeans = spelldiver(thosBeans);

        //limit the length
        thosBeans = thosBeans.substring(0, 80);
        
        // this is how we get the final file name, without overwriting existing files
        let theSequeltoBeans = thosBeans;
        let targetOutput =()=> path.join(final_final, theSequeltoBeans + path.extname(dudeWheresMyWavFile));
        let counter = 0;
        while (fs.existsSync(targetOutput())) {
          counter++;
          theSequeltoBeans = `${thosBeans} (${counter})`;
        }

        fs.copyFileSync(dudeWheresMyWavFile, targetOutput());
      } else {
        // no wave file?
      }
    } else {
      /* YOU GET NOTHING! YOU LOSE! GOOD DAY SIR!*/
    }
  }
}

// Execute the script
runPipeline();

