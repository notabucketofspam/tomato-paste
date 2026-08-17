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
            // Replaced nemoCtc with the transducer configuration
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

// Keep the recognizer loaded in memory so we don't reload it for every file
const recognizer = initRecognizer();

const transcripts = './transcripts';

fs.mkdirSync(transcripts, { recursive: true });

export function processAudio(filePath: string) {
  console.log(`Analyzing: ${filePath}`);

  let parsedPath = path.parse(filePath);
  const txtpath = path.join(transcripts, parsedPath.dir, `${parsedPath.name}.txt`);
    
  try {
    const waveData = readWave(filePath);        
    const stream = recognizer.createStream();

    stream.acceptWaveform({
      sampleRate: waveData.sampleRate,
      samples: waveData.samples
    });
        
    recognizer.decode(stream);
    const transcript = recognizer.getResult(stream).text;
    
    if (!transcript) {
      // console.log(`  -> No speech detected.`);
      return;
    }
    
    // console.log(`  -> Result: ${transcript}`);
    fs.writeFileSync(txtpath, transcript, 'utf8');
            
  } catch (error) {
      console.error(`  -> Failed to process ${filePath}:`, error);
      //process.abort();
      fs.writeFileSync(txtpath, `Error processing file: ${error instanceof Error ? error.message : String(error)}`, 'utf8');
  }
}


