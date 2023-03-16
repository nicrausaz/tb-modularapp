"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("./Routes"));
class Server {
    port;
    app;
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        (0, Routes_1.default)(this.app);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`⚡ Server running on port ${this.port}`);
        });
    }
}
exports.default = Server;
