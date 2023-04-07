"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function render() {
    const [counter, setCounter] = react_1.default.useState(0);
    react_1.default.useEffect(() => {
        setInterval(() => {
            setCounter((counter) => counter + 1);
        }, 1000);
    }, []);
    return (react_1.default.createElement("h1", null,
        "Hello world from the render function ",
        counter));
}
exports.default = render;
