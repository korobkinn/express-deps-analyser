import { XCode } from './xcode';
import type { IParser, IParseResult } from '../../types/parser-types';

const parsersArray: IParser[] = [new XCode()];

export function extractProjectInformation(tempDir: string): IParseResult {
    let result: IParseResult;

    for (let i = 0; i < parsersArray.length; i++) {
        result = parsersArray[i].parse(tempDir);
        if (result.projectInfo !== undefined) {
            return result;
        }
    }

    return { error: `Unable to parse directory ${tempDir}` };
}