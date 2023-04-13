"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function render({ name }) {
    return react_1.default.createElement("h1", null,
        "Hello world from the render ",
        name);
}
exports.default = render;
