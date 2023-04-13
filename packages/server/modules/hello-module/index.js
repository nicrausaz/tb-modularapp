"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_manager_1 = require("@yalk/module-manager");
class HelloModule extends module_manager_1.Module {
    interval;
    init() {
        console.log('Init from the HelloModule!');
        return this;
    }
    start() {
        console.log('Start from the HelloModule FIRST!', this.getEntryValue('message'));
        this.interval = setInterval(() => {
            console.log('emit')
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
