import path from 'node:path';
import fs from 'node:fs';
import sherpa from 'sherpa-onnx-node';

const { OfflineRecognizer, readWave } = sherpa;

function initRecognizer() {
  const modelDir = path.join(import.meta.dirname,'..', 'parakeet_model');
  const config = {
    featConfig: {
      sampleRate: 16000,
      featureDim: 80, 
    },
    modelConfig: {
      transducer: {
        encoder: path.join(modelDir, 'encoder.int8.onnx'),
        decoder: path.join(modelDir, 'decoder.int8.onnx'),
        joiner: path.join(modelDir, 'joiner.int8.onnx'),
      },
      tokens: path.join(modelDir, 'tokens.txt'),
      numThreads: 4, 
      debug: 1
    }
  };
  return new OfflineRecognizer(config);
}
const recognizer = initRecognizer();

// ===================== the actual meat of the day ====================================

/**this is the folder where mr. parakeet dumps his .txt files*/
const transcripts = './transcripts';

fs.mkdirSync(transcripts, { recursive: true });

export function processAudio(filePath: string) {
  console.log(`READING: ${filePath}`);

  // gotta dump them somewhere
  let parsedPath = path.parse(filePath);
  const txtpath = path.join(transcripts, `${parsedPath.name}.txt`);
    
  try {
    const waveData = readWave(filePath);        
    const stream = recognizer.createStream();

    stream.acceptWaveform({
      sampleRate: waveData.sampleRate,
      samples: waveData.samples
    });
        
    recognizer.decode(stream);
    const transcript = recognizer.getResult(stream).text;
        
    if (transcript) {
      // WRITE THIS DOWN
      fs.writeFileSync(txtpath, transcript, 'utf8');
    } else {
      // do nothing
    }
            
  } catch (error) {
      console.error(`Failure on ${filePath}:`, error);
      fs.writeFileSync(txtpath, String(error), 'utf8');
  }
}


