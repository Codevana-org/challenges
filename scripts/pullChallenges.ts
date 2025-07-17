import { createClient } from '@supabase/supabase-js';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'challenges';
const OUTPUT_DIR = './challenges';

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error('Supabase URL or Service Role Key is not set in environment variables.');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function walkDirectory(prefix = '') {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(prefix, {
      limit: 1000,
    });

  if (error) {
    console.error(`Error listing ${prefix}:`, error.message);
    return [];
  }

  let allFiles: string[] = [];

  for (const item of data) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

    if (!item.metadata) {
      // Manually recurse into folders
      const subFiles = await walkDirectory(fullPath);
      allFiles.push(...subFiles);
    } else {
      allFiles.push(fullPath);
    }
  }

  return allFiles;
}

async function downloadAllFiles() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = await walkDirectory();

  for (const filePath of files) {
    const { data: signedUrlData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 120);

    if (error || !signedUrlData?.signedUrl) {
      console.error(`Could not get URL for ${filePath}:`, error?.message);
      continue;
    }

    const res = await fetch(signedUrlData.signedUrl);
    const buffer = await res.buffer();

    const localPath = path.join(OUTPUT_DIR, filePath);
    await fs.ensureDir(path.dirname(localPath));
    await fs.writeFile(localPath, buffer);

    console.log(`✅ Downloaded: ${filePath}`);
  }

  console.log(`🎉 All files downloaded.`);
}

downloadAllFiles();