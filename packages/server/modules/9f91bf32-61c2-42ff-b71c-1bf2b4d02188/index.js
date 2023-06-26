"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
class HourModule extends module_1.Module {
    interval;
    init() {
        // Nothing to do here
    }
    destroy() {
        // Nothing to do here
    }
    start() {
        this.interval = setInterval(() => {
            this.notify({
                date: new Date().toLocaleString(),
            });
        }, this.getEntryValue('refreshRate'));
    }
    stop() {
        console.log('Stop from the HelloModule!');
        clearInterval(this.interval);
        this.removeAllListeners();
    }
    onReceive(data) {
        // Nothing to do here
    }
    onNewSubscriber() {
        // Nothing to do here
    }
}
exports.default = HourModule;
