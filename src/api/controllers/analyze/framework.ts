import { Request, Response } from 'express';
import { https } from 'follow-redirects';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import xcode from 'xcode';

export async function analyzeFramework(req: Request, res: Response) {

    fs.rmSync(process.env.TEMPDIRPATH, { recursive: true, force: true } );    
    fs.mkdirSync(process.env.TEMPDIRPATH);

    const file = fs.createWriteStream(process.env.TEMPDIRPATH + '\\'+ process.env.TEMPFILENAME);
    const sourcerype = req.body['SourceType'];
    const link = req.body['Link'];

    const request = https.get(link, function(response) {
        response.pipe(file);

        file.on('finish', async () => {
            
            file.close();
            console.log('Download Completed');

            await extract(path.resolve(file.path.toString()), {dir: path.resolve(process.env.TEMPDIRPATH).toString() });
        
            const fileCb = function(file) {
                console.log('Scanned file:'+ file.path);
                
                const compVersion = xcode.project(file.path)
                    .parseSync().getFirstProject()
                    .firstProject.compatibilityVersion
                    .replace(/^"(.*)"$/, '$1');
            
                console.log('Found compatibilityVersion: ' + compVersion);

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ compatibilityVersion: compVersion }, null, 3));
                
            };
            const dirCb = function(directory) {
                console.log('Scanned folder:'+ directory.path);
            };

            const dree = require('dree');
            dree.scan(path.resolve('tmp').toString(), { extensions: [ 'pbxproj' ] }, fileCb, dirCb);

        });
    });


  





}