import { createClient } from '@supabase/supabase-js';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'challenges';
const LOCAL_DIR = './challenges';

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error('Supabase URL or Service Role Key is not set in environment variables.');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Recursively walk the local directory and return all file paths.
 */
async function walkLocalFiles(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	let files: string[] = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const subFiles = await walkLocalFiles(fullPath);
			files.push(...subFiles);
		} else {
			files.push(fullPath);
		}
	}

	return files;
}

async function uploadAllFiles() {
	const files = await walkLocalFiles(LOCAL_DIR);

	for (const filePath of files) {
		const fileBuffer = await fs.readFile(filePath);
		const relativePath = path.relative(LOCAL_DIR, filePath).replace(/\\/g, '/'); // For Windows compatibility

		const { error } = await supabase.storage
			.from(BUCKET_NAME)
			.upload(relativePath, fileBuffer, {
				upsert: true,
			});

		if (error) {
			console.error(`❌ Failed to upload ${relativePath}:`, error.message);
		} else {
			console.log(`✅ Uploaded: ${relativePath}`);
		}
	}

	console.log('🎉 All files uploaded.');
}

uploadAllFiles();
