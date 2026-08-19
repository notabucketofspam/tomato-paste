import {spellbomb} from './big_dictionary.js';

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
import {transcripts, final_final} from './config_file.js';

/**
 * loop through everything in the transcripts folder, and...
 * find it in the extracted_audio/content/audio/us folder, and....
 * copy it into the final_final folder, and ...
 * rename it to be whatever is in the transcript
 */
export function Spelldivers2(allAudioFiles: string[]){
  const spelldiver = hellcheck();

  const teaFiles = fs.readdirSync(transcripts, { withFileTypes: true });
  for (const file of teaFiles){
    if (file.isFile() && file.name.endsWith('.txt')) {
      const maybeName = path.parse(file.name).name;
      const dudeWheresMyWavFile = allAudioFiles.find(f => path.parse(f).name === maybeName);
      if (dudeWheresMyWavFile) {
        // we actually have a wave file

        let thosBeans = fs.readFileSync(path.join(transcripts, file.name), 'utf-8');

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

