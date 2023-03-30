"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_manager_1 = require("@yalk/module-manager");
class HelloModule extends module_manager_1.Module {
    name = 'hello-module';
    description = 'A simple module that says hello';
    version = '1.0.0';
    _hello;
    interval;
    init() {
        console.log('Init from the HelloModule!');
        this._hello = 'Hello World after init!';
        return this;
    }
    start() {
        console.log('Start from the HelloModule!');
        this.interval = setInterval(() => {
            console.log(this._hello);
        }, 3000);
    }
    stop() {
        console.log('Stop from the HelloModule!');
        clearInterval(this.interval);
    }
    render() {
        return "";
    }
}
exports.default = HelloModule;
