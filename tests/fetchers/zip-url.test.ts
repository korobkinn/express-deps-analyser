import { fetchFromZipURL } from '../../src/services/fetchers/zip-url';
import express from 'express';
import { expect } from 'chai';
import path from 'path';
import fs from 'fs';
import https from 'https';


describe('ZIP-URL fetcher test', () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    process.env.TEMPFILENAME = 'example-sources.zip';

    const app = express();

    app.get('/example-sources.zip', function (request, response) {
        response.sendFile(path.join(__dirname, '../assets/example-sources.zip'));
    });

    const server = https.createServer(
        {
            key: fs.readFileSync(path.join(__dirname, '../assets/key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../assets/cert.pem')),
        },
        app);

    const tempDir = path.resolve('tests/test-temp');
    
    before((done) => {
        fs.rmSync(tempDir, { force: true, recursive: true });
        fs.mkdirSync(tempDir);
        server.listen(443);
        done();
    });

    after((done) => {
        fs.rmSync(tempDir, { force: true, recursive: true });
        server.close;
        done();
    });

    it('Should download and extract source by URL to zip archive', async function () {

        const link = 'https://localhost/example-sources.zip';

        await fetchFromZipURL(link, tempDir);

        const testSourceFileName = path.join(tempDir, 'test-sourcefile.txt');

        expect(fs.existsSync(testSourceFileName)).true;
        const content = fs.readFileSync(testSourceFileName, 'utf8');
        expect(content).equal('Test sourcefile content for zip-url fetcher.');
    });
});

