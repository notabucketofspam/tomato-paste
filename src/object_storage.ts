import fs from 'node:fs';
import path from 'node:path';

import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import {astext} from './finder.js';
import {mapConcurrent } from './ffmpeg.js';

const s3 = new S3Client({
    region: astext('./notkeys/region'),
    credentials: {
      accessKeyId: astext('./notkeys/access_key_id'),
			secretAccessKey: astext('./notkeys/secret_access_key'),
    },
    endpoint: astext('./notkeys/endpoint'),
});

async function getExistingKeys(bucket: string, prefix: string): Promise<Set<string>> {
  const keys = new Set<string>();
  let continuationToken: string | undefined;

  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    }));

    res.Contents?.forEach(obj => {
      if (obj.Key) keys.add(obj.Key);
    });

    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return keys;
}

export async function syncBucket(localDir:string){

  const bucket = astext('./notkeys/bucket');
  const s3Prefix = astext('./notkeys/prefix');

  // read the remote files
  const existingRemoteKeys = await getExistingKeys(bucket, s3Prefix);

  // read all the local files
  const files = await fs.promises.readdir(localDir, { recursive: true });
  const validFiles: string[] = [];
  for (const file of files) {
    const filePath = path.join(localDir, file);
    const fileStat = await fs.promises.stat(filePath);
    if (fileStat.isFile())
      validFiles.push(file);
  }
  console.log(`Found ${validFiles.length} local files. Checking against S3...`);

  // upload files that don't exist on S3
  await mapConcurrent(validFiles, 4, async (relPath) => {
    const s3Key = path.join(s3Prefix, relPath).replace(/\\/g, '/');
    if (existingRemoteKeys.has(s3Key)) {
      return;
    }

    const fullPath = path.join(localDir, relPath);
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: fs.readFileSync(fullPath),
      ContentType: fullPath.endsWith('.opus') ? 'audio/ogg; codecs=opus' : undefined,
    }));

    console.log(`Uploaded: ${s3Key}`);
  });

  // cleanup those that exist on remote but not locally
  const localS3Keys = new Set(validFiles.map(relPath => path.join(s3Prefix, relPath).replace(/\\/g, '/')));
  const keysToDelete: { Key: string }[] = [];
  for (const remoteKey of existingRemoteKeys) {
    if (!localS3Keys.has(remoteKey)) {
      keysToDelete.push({ Key: remoteKey });
    }
  }

  if (keysToDelete.length > 0) {
    console.log(`Found ${keysToDelete.length} orphaned files on S3. Deleting...`);
    await mapConcurrent(keysToDelete, 16, async (obj) => {
      await s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: obj.Key
      }));
    });
    console.log('Remote cleanup complete.');
  } else {
    console.log('No orphaned remote files to delete.');
  }
}

