import xcode from '../../src/services/parsers/xcode';
import { expect } from 'chai';
import path from 'path';

describe('XCODE parser test', () => {
    it('Should detect XCODE project with compatibilityVersion', async function () {
        const result = new xcode().parse(path.resolve('tests/assets/xcode-example-project'));
        console.log(result);
        expect(result).to.deep.equal({ compatibilityVersion: 'Xcode 14.0' });
    });
    it('Should detect XCODE project without compatibilityVersion information', async function () {
        const result = new xcode().parse(path.resolve('tests/assets/xcode-example-project-nocompat'));
        console.log(result);
        expect(result).to.deep.equal({ warning: 'Found XCODE project file, but without compatibility information' });
    });
    it('Should return error for non-detectable projects', async function () {
        const result = new xcode().parse(path.resolve('tests/assets/dotnet-example-project'));
        console.log(result);
        expect(result).to.deep.equal({ error: 'Noone supported framework detected' });
    });

});