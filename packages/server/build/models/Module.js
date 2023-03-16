"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Module {
    id;
    name;
    description;
    version;
    static fromJSON(json) {
        // TODO
        const module = new Module();
        Object.assign(module, JSON.parse(json));
        return module;
    }
}
exports.default = Module;
