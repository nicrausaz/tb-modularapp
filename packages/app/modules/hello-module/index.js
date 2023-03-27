"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = __importDefault(require("../modules/Module"));
class Hello extends Module_1.default {
    init() {
        console.log('init hello');
        return this;
    }
    start() {
        console.log('init hello');
    }
    stop() {
        console.log('init hello');
    }
    name = 'Hello';
    description = 'A simple module that says hello';
    version = '1.0.0';
    render() {
        return 'Hello World';
    }
}
exports.default = Hello;
