export default class Server {
    readonly port: number;
    private app;
    constructor(port: number);
    start(): void;
}
