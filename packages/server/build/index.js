"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { dirWatcher, loadModulesFromDirectory } from './libs/modules'
const path_1 = __importDefault(require("path"));
// import { Manager } from '@yalk/module-manager'
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const dirModules = path_1.default.join(__dirname, '..', 'modules');
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/modules', (req, res) => { });
app.get('/modules/:id', (req, res) => { });
app.listen(PORT, () => {
    console.log(`⚡ Server running on port ${PORT}`);
    // loadModulesFromDirectory(dirModules)
    // dirWatcher(dirModules)
    // Manager.getInstance().start()
});
