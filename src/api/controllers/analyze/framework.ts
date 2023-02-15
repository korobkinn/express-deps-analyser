import { Request, Response } from 'express';
//import got from 'got';
import https from 'https';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import readline from 'readline';
import xcode from 'xcode';

//import dree from 'dree';
const dree = require('dree');


export async function analyzeFramework(req: Request, res: Response) {
    
    if (!fs.existsSync(process.env.TEMPDIRPATH)){
        fs.mkdirSync(process.env.TEMPDIRPATH);
    }
    const file = fs.createWriteStream(process.env.TEMPDIRPATH + '\\'+ process.env.TEMPFILENAME);
    const sourcerype = req.body['SourceType'];
    const link = req.body['Link'];
    
    


    const request = https.get(link, function(response) {
        response.pipe(file);

        file.on('finish', () => {
            
            file.close();
            console.log('Download Completed');

            res.send({
                message: 'Download Completed',
            });
        });
    });

}