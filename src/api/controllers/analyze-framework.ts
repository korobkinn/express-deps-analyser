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

        const sourcetype = req.body['SourceType'].toLowerCase();
        const link = req.body['Link'];
        
        await fetchSourceCode(sourcetype, link, tempDir);
        
        let parseResult: string;

        for (let i = 0; i < parsersArray.length; i++) {
            parseResult = parsersArray[i].parse(tempDir);
            if (!((parseResult['error']) || (parseResult['warning']))) {
                break;
            }
        }

        const resBody = JSON.stringify(parseResult, null, 3);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(resBody);

    } catch (err) {
        const resBody = JSON.stringify({ 'error': err.message }, null, 3);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.send(resBody);
        console.log('Error occured: ' + err);
    } finally {
        fs.rmSync(tempDir, { force: true, recursive: true });
    }
}

async function fetchSourceCode (sourcetype: string, link : string, tempdir : string) {    
    if ( (sourcetype === 'github') || (sourcetype === 'bitbucket') ){
        await fetchFromZipURL(link, tempdir);
    }
    else{
        throw (new Error('No known fetchers found for given sourcetype'));
    }
}