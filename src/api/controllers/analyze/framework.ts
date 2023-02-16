import { Request, Response } from 'express';
import { https } from 'follow-redirects';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import stream from 'node:stream/promises';
import { Readable } from 'stream';

async function httpsPromisedGet(link): Promise<Readable> {
    return new Promise((resolve, reject) => {
        https.get(link, (response) => resolve(response)).on('error', reject);
    });
}

function findFileByExt(base, ext): string {

    var files = fs.readdirSync(base);
    var result = "";

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

export async function analyzeFramework(req: Request, res: Response) {
    const tempDir = path.resolve(process.env.TEMPDIRPATH);
    const tempFile = path.join(tempDir, process.env.TEMPFILENAME);

    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);
    const file = fs.createWriteStream(tempFile);

    const sourcetype = req.body['SourceType'];
    const link = req.body['Link'];

    const response = await httpsPromisedGet(link);
    await stream.pipeline(response, file);
    console.log('Download Completed');
    await extract(tempFile, { dir: tempDir });
    console.log('Sources extracted');

    const EXTENSION = 'pbxproj';
    const projFile = findFileByExt(tempDir, EXTENSION);
    if (projFile.length > 0) {

        let fileContent = fs.readFileSync(projFile, "utf8");
        let filematch = fileContent.match("(compatibilityVersion[ =]*)\"(.*)\"");

        if (filematch !== null) {
            res.setHeader('Content-Type', 'application/json').send(JSON.stringify({ compatibilityVersion: filematch[2] }, null, 3));
            console.log('Found XCODE project file with compatibility information');
        }
        else {
            res.setHeader('Content-Type', 'application/json').send(JSON.stringify({ error: 'Found XCODE project file, but without compatibility information' }, null, 3));
            console.log('Found XCODE project file, but without compatibility information');
        }

    }
    else {
        if (!res.writableEnded) {
            res.setHeader('Content-Type', 'application/json').send(JSON.stringify({ error: 'Noone supported framework detected' }, null, 3));
            console.log('Noone supported framework detected');
        }
    }
}