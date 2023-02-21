import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fetchFromZipURL } from '../services/fetchers/zip-url';
import { extractProjectInformation } from '../services/parsers/parsers';

export async function analyzeFramework(req: Request, res: Response) {
    const tempDir = path.resolve(process.env.TEMPDIRPATH);

    try {
        fs.rmSync(tempDir, { force: true, recursive: true });
        fs.mkdirSync(tempDir);

        const sourcetype = req.body['SourceType'].toLowerCase();
        const link = req.body['Link'];

        await fetchSourceCode(sourcetype, link, tempDir);

        const parseResult = extractProjectInformation(tempDir);

        res.statusCode = 200;

        const error = { error: `Unable to analyze framework for ${link}` };
        res.send(parseResult.projectInfo ?? error);
        
    } catch (err) {

        console.error('Error occured: ', err);
        res.statusCode = 500;        
        res.json({ error: 'Server error' });        

    } finally {
        fs.rmSync(tempDir, { force: true, recursive: true });
    }
}

async function fetchSourceCode(sourcetype: string, link: string, tempdir: string) {
    if ((sourcetype === 'github') || (sourcetype === 'bitbucket')) {
        await fetchFromZipURL(link, tempdir);
    }
    else {
        throw (new Error('No known fetchers found for given sourcetype'));
    }
}