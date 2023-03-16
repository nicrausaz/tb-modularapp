export default class Module {
    id: string;
    name: string;
    description: string;
    version: string;
    static fromJSON(json: string): Module;
}
