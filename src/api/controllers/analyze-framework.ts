import { Request, Response } from 'express';
import { https } from 'follow-redirects';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import stream from 'node:stream/promises';
import { Readable } from 'stream';

async function httpsPromisedGet(link): Promise<Readable> {
    return new Promise((resolve, reject) => {
        https.get(link, (response) =>
            resolve(response)).
            on('error', reject);
    });
}

function findFileByExt(base, ext): string {
    const files = fs.readdirSync(base);
    let result = '';

    for (let i = 0; i < files.length; i++) {

        const newbase = path.join(base, files[i]);

        if (fs.statSync(newbase).isDirectory()) {
            result = findFileByExt(newbase, ext);
            if (result.length > 0) {
                break;
            }
        }
        else if (fs.statSync(newbase).isFile() && (files[i].substring((ext.length + 1)) === ext)) {
            result = newbase;
            break;
        }
    }

    return result;
}

//GitHub and BitBucket provide sources as zip archive
async function fetchSourceFromZipURL(url: string, tempdirpath: string) {
    const response = await httpsPromisedGet(url);

    let fetchedZip = path.join(tempdirpath, process.env.TEMPFILENAME);
    const file = fs.createWriteStream(fetchedZip);

    await stream.pipeline(response, file);
    console.log('Download Completed');

    await extract(fetchedZip, { dir: tempdirpath });
    console.log('Sources extracted');
}

function parseXCode(projectFolderPath: string): string {
    const EXTENSION = 'pbxproj';
    const projFile = findFileByExt(projectFolderPath, EXTENSION);

    if (projFile.length > 0) {
        const fileContent = fs.readFileSync(projFile, 'utf8');
        const filematch = fileContent.match('(compatibilityVersion[ =]*)"(.*)"');

        if (filematch) {
            console.log('Found XCODE project file with compatibility information');
            return (JSON.stringify({ compatibilityVersion: filematch[2] }, null, 3));

        }
        else {
            console.log('Found XCODE project file, but without compatibility information');
            return (JSON.stringify({ warning: 'Found XCODE project file, but without compatibility information' }, null, 3));
        }
    }
    else {
        console.log('Noone supported framework detected');
        return (JSON.stringify({ error: 'Noone supported framework detected' }, null, 3));
    }
}

export async function analyzeFramework(req: Request, res: Response) {
    const tempDir = path.resolve(process.env.TEMPDIRPATH);
    const tempFile = path.join(tempDir, process.env.TEMPFILENAME);

    try {
        fs.rmSync(tempDir, { force: true, recursive: true });
        fs.mkdirSync(tempDir);

        const sourcetype = req.body['SourceType'];
        const link = req.body['Link'];

        await fetchSourceFromZipURL(link, tempDir);

        res.setHeader('Content-Type', 'application/json').send(parseXCode(tempDir));
        
    } catch (err) {
        res.setHeader('Content-Type', 'application/json').send(JSON.stringify({ error: err }, null, 3));
        console.log('Error occured: ' + err);
    } finally {
        fs.rmSync(tempDir, { force: true, recursive: true });
    }
}