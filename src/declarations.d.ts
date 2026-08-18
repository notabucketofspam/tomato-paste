// typescript is a grumpy old man

declare module 'sherpa-onnx-node' {
  export interface OfflineRecognizerConfig {
    featConfig?: { sampleRate?: number; featureDim?: number; };
    modelConfig?: {
      nemoCtc?: { model: string; };
      transducer?: {
        encoder: string;
        decoder: string;
        joiner: string;
      };
      tokens: string;
      numThreads?: number;
      debug?: number;
    };
  }

  export class OfflineStream {
    acceptWaveform(data: { sampleRate: number; samples: Float32Array }): void;
  }

  export class OfflineRecognizer {
    constructor(config: OfflineRecognizerConfig);
    createStream(): OfflineStream;
    decode(stream: OfflineStream): void;
    getResult(stream: OfflineStream): { text: string };
  }

  export function readWave(filename: string): { 
    samples: Float32Array; 
    sampleRate: number; 
  };

  const sherpa: {
    OfflineRecognizer: typeof OfflineRecognizer;
    readWave: typeof readWave;
  };
  export default sherpa;
}

