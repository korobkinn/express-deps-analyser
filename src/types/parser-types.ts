export interface IParser {
    parse(string);
}

export interface IParseResult {
    projectInfo?: object;
    error?: string;
}