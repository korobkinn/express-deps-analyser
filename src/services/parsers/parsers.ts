import { XCode } from './xcode';
import type { IParser, IParseResult } from '../../types/parser-types';

const parsersArray: IParser[] = [new XCode()];

export function extractProjectInformation(tempDir: string): IParseResult {
    for (let i = 0; i < parsersArray.length; i++) {
        const result = parsersArray[i].parse(tempDir);
        if (result.projectInfo !== undefined) {
            return result;
        }
    }
    return { error: `No project information found in ${tempDir}` };
}