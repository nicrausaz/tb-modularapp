"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_manager_1 = require("@yalk/module-manager");
class HelloModule extends module_manager_1.Module {
    name = 'hello-module';
    description = 'A simple module that says hello';
    version = '1.0.0';
    hello = 'Hello World! from module';
    interval;
    init() {
        console.log('Init from the HelloModule!');
        return this;
    }
    start() {
        console.log('Start from the HelloModule!');
        this.interval = setInterval(() => {
            // console.log('update')
            this.emit('update', this.hello + ' ' + new Date().toISOString());
        }, 3000);
        this.on('create', (data) => {
            console.log('Received create event from the HelloModule!', data);
        });
    }
    stop() {
        console.log('Stop from the HelloModule!');
        clearInterval(this.interval);
        this.removeAllListeners();
    }
    render() {
        return "";
    }
}
exports.default = HelloModule;
