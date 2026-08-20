import {spellbomb} from './big_dictionary.js';
import {findAllFiles} from './finder.js';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**thanks gemini*/
function createTextCorrector(dictionary: Map<string, string>) {
  const sortedKeys = Array.from(dictionary.keys())
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);

  const pattern = new RegExp(`\\b(${sortedKeys.join('|')})\\b`, 'gi');

  return (text: string): string => {
    if (text.length === 0) {
      // fix for the one file that's glitched
      return 'Liberty Prosperity Democracy';
    } else {
      return text.replace(pattern, (match) => {
        const key = match.toLowerCase();
        return dictionary.get(key) ?? match;
      });
    }
  };
}

/**Spellbomb armed! Clear the area!*/
function hellcheck(){
  return createTextCorrector(spellbomb);
}

import path from 'node:path';
import fs from 'node:fs';
import {transcripts, final_final, extracted_audio} from './config_file.js';

/**
 * loop through everything in the transcripts folder, and...
 * find it in the extracted_audio/content/audio/us folder, and....
 * copy it into the final_final folder, and ...
 * rename it to be whatever is in the transcript
 */
export function Spelldivers2(){
  const spelldiver = hellcheck();
  
  /** all of the txt transcripts*/
  const teaFiles = findAllFiles(transcripts, '.txt');

  /** all of the extracted wav files*/
  const extractedAudioFiles = fs.readdirSync(extracted_audio, { withFileTypes: true,recursive:true });

  for (const waveFile of extractedAudioFiles){
    const normalWaveSrcPath = path.join(waveFile.parentPath, waveFile.name);
    if (waveFile.isFile() && waveFile.name.endsWith('.wav')) {
      /**the actual name of the file (it's just a bunch of numbers)*/
      const maybeName = path.parse(waveFile.name).name;

      const textFile = teaFiles.find(f => path.parse(f).name === maybeName);
      if (textFile) {
        // we actually have a text file to go with this wave file
        
        // read the transcript
        let thosBeans = fs.readFileSync(textFile, 'utf-8');

        //clean up the transcript
        thosBeans = thosBeans.replace(/[^\w\s]|\r|\n/gm, "").trim();

        // do the spell-checking
        thosBeans = spelldiver(thosBeans);

        //limit the length
        thosBeans = thosBeans.substring(0, 80);
        
        // this is how we get the final file name, without overwriting existing files
        let theSequeltoBeans = thosBeans;
        let targetOutput =()=> path.join(final_final, theSequeltoBeans + path.extname(waveFile.name));
        let counter = 0;
        while (fs.existsSync(targetOutput())) {
          counter++;
          theSequeltoBeans = `${thosBeans} (${counter})`;
        }

        fs.copyFileSync(normalWaveSrcPath, targetOutput());
      } else {
        // no text file? just copy the wave file over with its original name
        fs.copyFileSync(normalWaveSrcPath, path.join(final_final, waveFile.name));
      }
    } else {
      // this is not a wave file
    }
  }
}

