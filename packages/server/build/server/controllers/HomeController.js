"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HomeController {
    homeRepository;
    constructor(homeRepository) {
        this.homeRepository = homeRepository;
        // this.index = this.index.bind(this)
    }
    index = (req, res) => {
        console.log('idnex', this.homeRepository);
        const response = this.homeRepository.hello() + 'This is the response from the index method in the HomeController';
        res.send(response);
    };
}
exports.default = HomeController;
