import xcode from '../../src/services/parsers/xcode';
import { expect } from 'chai';
import path from 'path';

describe('XCODE parser test', () => {
    it('Should detect XCODE project with compatibilityVersion', async function () {
        const result = new xcode().parse(path.resolve('tests/assets/xcode-example-project'));
        console.log(result);
        expect(result).to.deep.equal({ compatibilityVersion: 'Xcode 14.0' });
    });
});