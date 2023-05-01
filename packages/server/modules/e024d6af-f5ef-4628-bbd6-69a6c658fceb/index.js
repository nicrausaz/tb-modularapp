"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
class HourModule extends module_1.Module {
    interval;
    init() {
        return this;
    }
    destroy() {
        // Nothing to do here
    }
    start() {
        this.interval = setInterval(() => {
            this.emit('update', {
                date: new Date().toLocaleString(),
            });
        }, this.getEntryValue('refreshRate'));
        // this.on('create', (data) => {
        //   console.log('Received create event from the HelloModule!', data)
        // })
    }
    stop() {
        console.log('Stop from the HelloModule!');
        clearInterval(this.interval);
        this.removeAllListeners();
    }
}
exports.default = HourModule;
