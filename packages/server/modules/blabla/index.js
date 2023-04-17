"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
class HelloModule extends module_1.Module {
    interval;
    init() {
        console.log('Init from the HelloModule!');
        return this;
    }
    destroy() {
        console.log('Destroyed the HelloModule!');
    }
    start() {
        console.log('Start from the HelloModule!', this.getEntryValue('refreshRate'));
        this.interval = setInterval(() => {
            this.emit('update', this.getEntryValue('message'));
        }, this.getEntryValue('refreshRate'));
        this.on('create', (data) => {
            console.log('Received create event from the HelloModule!', data);
        });
    }
    stop() {
        console.log('Stop from the HelloModule!');
        clearInterval(this.interval);
        this.removeAllListeners();
    }
}
exports.default = HelloModule;
