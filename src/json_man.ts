import {findAllFiles, astext} from "./finder.js";

import fs from 'node:fs';
import path from 'node:path';

import {
	opodes_out,
	json_out
} from './config_file.js';

export function writeOutJson(){
	const allNames = findAllFiles(opodes_out, '.opus').map(f=>path.parse(f).name);
	const fnames = allNames.sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}));
	const jsonPath = path.join(json_out, 'ListObjects.json');
	fs.mkdirSync(json_out, { recursive: true });
	fs.writeFileSync(jsonPath, JSON.stringify(fnames));

	// copy the json to his new home
	const clockbot_target_dir = path.normalize(astext('./notkeys/clockbot_target_dir'));
	fs.mkdirSync(clockbot_target_dir, { recursive: true });
	fs.copyFileSync(jsonPath, path.join(clockbot_target_dir, 'ListObjects.json'));
}

