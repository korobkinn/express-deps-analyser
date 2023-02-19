import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fetchFromZipURL } from '../../services/fetchers/zip-url';
import { parsersArray } from '../../services/parsers/parsers';

export async function analyzeFramework(req: Request, res: Response) {
    const tempDir = path.resolve(process.env.TEMPDIRPATH);

    try {
        fs.rmSync(tempDir, { force: true, recursive: true });
        fs.mkdirSync(tempDir);

        let sourcetype = req.body['SourceType'].toLowerCase();
        const link = req.body['Link'];
        switch (sourcetype) {
            case 'github' || 'bitbucket':
                await fetchFromZipURL(link, tempDir);
                break;
            default:
                let err = new Error('No known fetchers found for given sourcetype')
                throw (err);
        }

        let parseResult: string;

        for (let i = 0; i < parsersArray.length; i++) {
            parseResult = parsersArray[i].parse(tempDir);
            if (!((parseResult['error']) || (parseResult['warning']))) {
                break;
            }
        }

        res.setHeader('Content-Type', 'application/json').send(JSON.stringify(parseResult, null, 3));

    } catch (err) {
        res.setHeader('Content-Type', 'application/json').send(JSON.stringify({ 'error': err.message }, null, 3));
        console.log('Error occured: ' + err);
    } finally {
        fs.rmSync(tempDir, { force: true, recursive: true });
    }
}