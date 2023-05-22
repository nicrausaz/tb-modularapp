"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
const serialport_1 = require("serialport");
class RFIDModule extends module_1.Module {
    init() {
        // Nothing to do here
    }
    destroy() {
        // Nothing to do here
    }
    start() {
        const port = new serialport_1.SerialPort({
            path: '/dev/tty-usbserial1',
            baudRate: 57600,
        }, (err) => {
            if (err) {
                console.error(err);
            }
        });
        port.open((err) => {
            if (err) {
                console.error(err);
            }
        });
        port.on('data', (data) => {
            console.log(data.toString('utf8'));
        });
    }
    stop() {
        //
    }
    onReceive(data) {
        // Nothing to do here
    }
}
exports.default = RFIDModule;
