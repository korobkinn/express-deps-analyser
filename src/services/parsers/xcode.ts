import fs from 'fs';
import path from 'path';
import type { IParser, IParseResult } from '../../types/parser-types';

export class XCode implements IParser {

    parse(projectFolderPath: string): IParseResult {
        const EXTENSION = 'pbxproj';
        const projFile = XCode.findFileByExt(projectFolderPath, EXTENSION);


        if (projFile.length > 0) {
            const fileContent = fs.readFileSync(projFile, 'utf8');
            const filematch = fileContent.match('(compatibilityVersion[ =]*)"(.*)"');

            if (filematch) {
                console.log('Found XCODE project file with compatibility information');
                return { projectInfo: { compatibilityVersion: filematch[2] } };
            }
            else {
                console.log('Found XCODE project file, but without compatibility information');
                return { error: 'Found XCODE project file, but without compatibility information' };
            }
        }
        else {
            console.log('No supported framework detected');
            return { error: 'No supported framework detected' };
        }
    }

    static findFileByExt(base, ext): string {
        const files = fs.readdirSync(base);
        let result = '';

        for (let i = 0; i < files.length; i++) {

            const newbase = path.join(base, files[i]);

            if (fs.statSync(newbase).isDirectory()) {
                result = XCode.findFileByExt(newbase, ext);
                if (result.length > 0) {
                    break;
                }
            }
            else if (fs.statSync(newbase).isFile() && (files[i].substring((ext.length + 1)) === ext)) {
                result = newbase;
                break;
            }
        }

        return result;
    }
}