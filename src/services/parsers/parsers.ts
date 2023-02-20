import xcode from './xcode';

export interface IParser {
    parse(string);
}

const parsersArray : IParser[] = [ new xcode() ];

export function parse(tempDir : string) : string {
    let result : string;
    for (let i = 0; i < parsersArray.length; i++) {
        result = parsersArray[i].parse(tempDir);
        if (!((result['error']) || (result['warning']))) {
            break;
        }
    }
    return result;
}