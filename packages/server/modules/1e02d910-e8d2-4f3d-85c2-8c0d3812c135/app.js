"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const module_1 = require("@yalk/module");
class HelloModuleRenderer extends module_1.ModuleRenderer {
    render({ name, last }) {
        return (react_1.default.createElement("div", { className: "p-6 bg-white border border-gray-200 rounded-lg shadow text-center" },
            react_1.default.createElement("h5", { className: "mb-2 text-2xl font-bold tracking-tight text-red-900 italic" }, "Debug module"),
            react_1.default.createElement("p", { className: "font-normal text-gray-700 text-2xl" }, name),
            react_1.default.createElement("p", { className: "font-normal text-gray-700 text-xl" }, last)));
    }
}
exports.default = HelloModuleRenderer;