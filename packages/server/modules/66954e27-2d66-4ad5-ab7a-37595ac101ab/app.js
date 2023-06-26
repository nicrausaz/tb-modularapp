"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const module_1 = require("@yalk/module");
class ComposalStampRFIDRenderer extends module_1.ModuleRenderer {
    render({ status, additionalMessage, data }) {
        const avatar = data?.avatar_url || '/assets/placeholder.svg';
        if (status === 'loading') {
            return (react_1.default.createElement("div", { className: "w-full h-full flex justify-center" },
                react_1.default.createElement("span", { className: "loading loading-ring loading-lg" }),
                status));
        }
        if (status === 'start') {
            return (react_1.default.createElement("div", { className: "card bg-base-100" },
                react_1.default.createElement("div", { className: "card-body flex flex-row items-center" },
                    react_1.default.createElement("img", { src: avatar, className: "w-28 h-28 mask mask-squircle" }),
                    react_1.default.createElement("div", { className: "ml-2 w-full" },
                        react_1.default.createElement("h2", { className: "card-title text-2xl" },
                            "Welcome ",
                            data.display_name,
                            " !"),
                        react_1.default.createElement("p", { className: "mb-2 flex items-center justify-between w-full" },
                            react_1.default.createElement("div", null, "You just clocked in !"),
                            react_1.default.createElement("span", { className: "text-4xl font-bold" }, "08:00")),
                        react_1.default.createElement("div", { className: "card-actions justify-end" }, additionalMessage)))));
        }
        if (status === 'end') {
            return (react_1.default.createElement("div", { className: "card bg-base-100" },
                react_1.default.createElement("div", { className: "card-body flex flex-row items-center" },
                    react_1.default.createElement("img", { src: avatar, className: "w-28 h-28 mask mask-squircle" }),
                    react_1.default.createElement("div", { className: "ml-2 w-full" },
                        react_1.default.createElement("h2", { className: "card-title text-2xl" },
                            "Goodbye ",
                            data.display_name,
                            " !"),
                        react_1.default.createElement("p", { className: "mb-2 flex items-center justify-between w-full" },
                            react_1.default.createElement("div", null, "You just clocked out !"),
                            react_1.default.createElement("span", { className: "text-4xl font-bold" }, "17:00"))))));
        }
        if (status === 'error') {
            return (react_1.default.createElement("div", { className: "p-6 bg-warning border border-gray-200 rounded-lg shadow text-center" },
                react_1.default.createElement("h5", { className: "mb-2 text-2xl font-bold tracking-tight text-gray-900 italic" }, additionalMessage)));
        }
        // Default status is 'idle'
        return (react_1.default.createElement("div", { className: "w-full h-full flex justify-center" },
            react_1.default.createElement("h2", { className: "card-title text-2xl p-6" }, "Please scan your card")));
    }
}
exports.default = ComposalStampRFIDRenderer;
