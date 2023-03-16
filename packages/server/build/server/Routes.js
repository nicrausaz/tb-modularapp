"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HomeController_1 = __importDefault(require("./controllers/HomeController"));
const repositories_1 = require("./repositories");
/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
const configureRoutes = (app) => {
    // Create the repositories
    const homeRepository = new repositories_1.HomeRepository();
    console.log('homeRepository', homeRepository);
    // Create the controllers
    const homeController = new HomeController_1.default(homeRepository);
    // Defines the routes used by the application
    app.get('/', homeController.index);
    // Defines the routes used to expose the API for device interaction
    app.get('/api', homeController.index);
};
exports.default = configureRoutes;
