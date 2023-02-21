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

//GitHub and BitBucket provide sources as zip archive
export async function fetchFromZipURL(url: string, tempdirpath: string) {
    const response = await httpsPromisedGet(url);

    const fetchedZip = path.join(tempdirpath, process.env.TEMPFILENAME);
    const file = fs.createWriteStream(fetchedZip);

    await stream.pipeline(response, file);
    console.log('Download Completed');

    await extract(fetchedZip, { dir: tempdirpath });
    console.log('Sources extracted');
}