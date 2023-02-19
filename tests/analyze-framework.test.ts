import { app, server } from '../src/index';
import { agent as request } from 'supertest';
import { expect } from 'chai';

describe('/api/v1/analyze/framework tests', () => {
    describe('Zip-fetcher tests', () => {
        it('Should detect XCODE project with compatibilityVersion', async function () {

            const res = await request(app)
                .post('/api/v1/analyze/framework')
                .set('Content-Type', 'application/json')
                .send({
                    'SourceType': 'GitHub',
                    'Link': 'https://github.com/Oleg-Karoza/App1/archive/refs/heads/main.zip'
                });

            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.deep.equal({ compatibilityVersion: 'Xcode 14.0' });

        });

        it('Should not detect .NET project types', async function () {

            const res = await request(app)
                .post('/api/v1/analyze/framework')
                .set('Content-Type', 'application/json')
                .send({
                    'SourceType': 'GitHub',
                    'Link': 'https://github.com/Oleg-Karoza/ConsoleApp1/archive/refs/heads/main.zip'
                });

            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.deep.equal({ error: 'Noone supported framework detected' });

        });

        it('Should show error for wrong source server path', async function () {

            const res = await request(app)
                .post('/api/v1/analyze/framework')
                .set('Content-Type', 'application/json')
                .send({
                    'SourceType': 'GitHub',
                    'Link': 'https://github.com/Oleg-Karoza/ConsoleApp1/blob/main/ConsoleApp1.sl'
                });

            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.deep.equal({ error: 'end of central directory record signature not found' });

        });

        it('Should show error for wrong source server domain', async function () {

            const res = await request(app)
                .post('/api/v1/analyze/framework')
                .set('Content-Type', 'application/json')
                .send({
                    'SourceType': 'GitHub',
                    'Link': 'https://github_exabple.com/ConsoleApp1.sl'
                });

            expect(res.status).to.equal(200);
            expect(res.body).not.to.be.empty;
            expect(res.body).to.deep.equal({ error: 'getaddrinfo ENOTFOUND github_exabple.com' });

        });
    });
});

server.close();