"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
class HelloModule extends module_1.Module {
    init() {
        return this;
    }
    destroy() {
        // Nothing to do here
    }
    start() {
        this.emit('update', {
            name: 'Nicolas',
        });
    }
    stop() {
        this.removeAllListeners();
    }
}
exports.default = HelloModule;
