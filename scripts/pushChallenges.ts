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

/**
 * Recursively list all files in the bucket
 */
async function walkBucket(prefix = ''): Promise<string[]> {
	const { data, error } = await supabase.storage
		.from(BUCKET_NAME)
		.list(prefix, { limit: 1000 });

	if (error) {
		console.error(`Error listing ${prefix}:`, error.message);
		return [];
	}

	let allFiles: string[] = [];

	for (const item of data) {
		const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
		if (!item.metadata) {
			const subFiles = await walkBucket(fullPath);
			allFiles.push(...subFiles);
		} else {
			allFiles.push(fullPath);
		}
	}

	return allFiles;
}

/**
 * Delete all files in the bucket before uploading
 */
async function clearBucket() {
	const filesToDelete = await walkBucket();

	if (filesToDelete.length === 0) {
		console.log('🧹 Bucket already empty.');
		return;
	}

	const { error } = await supabase.storage
		.from(BUCKET_NAME)
		.remove(filesToDelete);

	if (error) {
		console.error('❌ Failed to clear bucket:', error.message);
	} else {
		console.log(`🧹 Cleared ${filesToDelete.length} file(s) from bucket.`);
	}
}

async function uploadAllFiles() {
	await clearBucket();

	const files = await walkLocalFiles(LOCAL_DIR);

	for (const filePath of files) {
		const fileBuffer = await fs.readFile(filePath);
		const relativePath = path.relative(LOCAL_DIR, filePath).replace(/\\/g, '/');

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
