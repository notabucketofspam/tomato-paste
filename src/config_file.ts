// ======================= folders with tools in them ======================

/**this is the path to the filediver executable */
export const filediverExePath = './dongles/filediver.exe';

/**this is where ffmpeg.exe lives (he's roommates with filediver.exe)*/
export const ffmpegExePath = './dongles/ffmpeg.exe';

/**this is the folder that has all of the parakeet model files*/
export const parakeetModelFolder = './parakeet_model'

// ==================== folders with output files ===========================

/**this is the folder where mr. parakeet dumps his .txt files*/
export const transcripts = './transcripts';

/**thus is the folder where filediver.exe dumps his .wav files*/
export const extracted_audio = './extracted_audio';

/**this is the folder where all of the final (final) WAVE files go to rest*/
export const final_final = './final_final';

/**we get some opodes from ffmpeg and we put them in here*/
export const opodes_out = './opodes_out';

/**a folder where ListObjects.json goes */
export const json_out = './json_out';

// =================== enable specific parts of the pipeline =========================

/**enable this to do the file extract from Helldivers(TM) 2*/
export const RUN_FILEDIVER = false;

/**the actual AI transcript thing */
export const RUN_TRANSCRIPTS = false;

/**check his spelling*/
export const RUN_SPELLCHECKING = true;

/**convert the .wav files to .opus files*/
export const RUN_FFMPEG = true;

/**sync to bucket*/
export const RUN_OSYNC = true;

