"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
class HelloModule extends module_1.Module {
    lastReceivedData;
    init() {
        console.log('Debug module initialized');
    }
    destroy() {
        console.log('Debug module destroyed');
    }
    start() {
        console.log('Debug module started');
        setInterval(() => {
            this.notify({
                name: this.getEntryValue('message'),
                last: this.lastReceivedData,
            });
        }, this.getEntryValue('refreshRate'));
    }
    stop() {
        console.log('Debug module stopped');
        this.removeAllListeners();
    }
    onReceive(data) {
        console.log('The module hello received', data);
        this.lastReceivedData = data.message;
    }
}
exports.default = HelloModule;
