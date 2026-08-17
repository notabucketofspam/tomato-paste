import fs from 'node:fs';
import path from 'node:path';

function findAudioFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filePaths: string[] = [];

  for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
        
    if (entry.isDirectory()) {
      // If it's a folder, run this function again to dig inside it
      const nestedFiles = findAudioFiles(fullPath);
      filePaths.push(...nestedFiles);
    } else if (entry.isFile() && (fullPath.endsWith('.wav') || fullPath.endsWith('.ogg'))) {
      // If it's a file and ends in .wav or .ogg, add it to our list
      filePaths.push(fullPath);
    }
  }
  return filePaths;
}

import {runFilediver} from './audio_extract.js';
import {processAudio} from './whisperish.js';

// 4. The main pipeline runner
function runPipeline() {
  const extracted_audio = './extracted_audio';

  console.log(`Using filediver to extract audio to: ${extracted_audio}... this may take a while.`);
  // await runFilediver(extracted_audio);
    
  const allAudioFiles = findAudioFiles(extracted_audio);

  console.log(`Found ${allAudioFiles.length} audio files. Starting AI transcription... \n`);

  // Loop through each file one by one
  for (const file of allAudioFiles) {
      // processAudio(file);
  }

  // loop through everything in the transcripts folder, and...
  // find it in the extracted_audio/content/audio/us folder, and....
  // copy it into the final_final folder, and ...
  // rename it to be whatever is in the transcript

  const final_final = './final_final';
  fs.mkdirSync(final_final, { recursive: true });

  const teaFiles = fs.readdirSync('./transcripts', { withFileTypes: true });
  for (const file of teaFiles){
    if (file.isFile() && file.name.endsWith('.txt')) {
      const maybeName = path.parse(file.name).name;
      const dudeWheresMyWavFile = allAudioFiles.find(f => path.parse(f).name === maybeName);
      if (dudeWheresMyWavFile) {
        let thosBeans = fs.readFileSync(path.join('./transcripts', file.name), 'utf-8');
        //clean up the transcript
        thosBeans = thosBeans.replace(/[^\w\s]|\r|\n/gm, "").trim();
        //limit the length
        thosBeans = thosBeans.substring(0, 80);
        
        let theSequeltoBeans = thosBeans;

        // this is how we get the final file name, without overwriting existing files
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
    } else {/* YOU GET NOTHING! YOU LOSE! GOOD DAY SIR!*/}
  }
}

// Execute the script
runPipeline();
