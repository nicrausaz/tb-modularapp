import express from 'express';
/**
 * Define all the routes for the application
 *
 * @param app The express application
 */
declare const configureRoutes: (app: express.Application) => void;
export default configureRoutes;
