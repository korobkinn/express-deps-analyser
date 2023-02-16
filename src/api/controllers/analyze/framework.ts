import { Request, Response } from 'express';
import { https } from 'follow-redirects';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import xcode from 'xcode';

import stream from 'node:stream/promises';
import { Readable } from 'stream';

async function httpsPromisedGet(link): Promise<Readable> {
    return new Promise((resolve, reject) => {
        https.get(link, (response) => resolve(response)).on('error', reject);
    });
}


function findFilesByExt(base,ext,files,result) 
{
    files = files || fs.readdirSync(base); 
    result = result || []; 

    files.forEach( 
        function (file) {
            const newbase = path.join(base,file);
            if ( fs.statSync(newbase).isDirectory() )
            {
                result = findFilesByExt(newbase,ext,fs.readdirSync(newbase),result);
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                {
                    result.push(newbase);
                } 
            }
        }
    );
    return result;
}

export async function analyzeFramework(req: Request, res: Response) {

    const tempDir = path.resolve(process.env.TEMPDIRPATH);
    const tempFile = path.join(tempDir, process.env.TEMPFILENAME);
    
    fs.rmSync(tempDir, { recursive: true, force: true } );    
    fs.mkdirSync(tempDir);

    const file = fs.createWriteStream(tempFile);
    const sourcerype = req.body['SourceType'];
    const link = req.body['Link'];

    const response = await httpsPromisedGet(link);

    await stream.pipeline(response, file);

    console.log('Download Completed');

    await extract(tempFile, {dir: tempDir });
    console.log('Sources extracted');

    const EXTENSION = 'pbxproj';

    const projFiles = findFilesByExt(tempDir, EXTENSION, null , null);

    if (projFiles.length > 0){
    
        const compVersion = xcode.project(projFiles[0])
            .parseSync().getFirstProject()
            .firstProject.compatibilityVersion
            .replace(/^"(.*)"$/, '$1');

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ compatibilityVersion: compVersion }, null, 3));
    
        console.log('Found');
    }
    else
    {
        if (!res.writableEnded)
        {
            res.end('Noone supported framework detected');
        }
    }

}