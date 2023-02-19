import xcode from './xcode';

export interface IParser {
    parse(string);
}

export class Parser {

    protected parser : IParser;
    constructor(parser: IParser) {
        this.parser = parser;
    }

    parse(projectFolderPath : string) : string {
        return this.parser.parse(projectFolderPath);
    }
}

export const parsersArray : Parser[] = [ new Parser(new xcode) ];