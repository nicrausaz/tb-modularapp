"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("@yalk/module");
class ComposalStampRFID extends module_1.Module {
    init() {
        // Nothing to do here
    }
    destroy() {
        // Nothing to do here
    }
    start() {
        process.stdin.on('data', (data) => {
            const id = data.toString('utf8').trim();
            this.notify({
                status: 'loading',
                data: id,
            });
            this.toggleClocking(id);
        });
        process.stdin.on('error', (error) => {
            console.error("Erreur d'entrée standard :", error);
        });
        process.on('exit', () => this.stop());
        process.stdin.resume();
    }
    stop() {
        process.stdin.pause();
    }
    onReceive(data) {
        // Nothing to do here
    }
    onNewSubscriber() {
        // this.notify({
        //     status: 'idle',
        //     data: null,
        // });
    }
    toggleClocking = async (rfid) => {
        const url = this.getEntryValue('composalUrl');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer NUYC7IzclxqvGI3NyTKrzApO379nmeAyDE-2BYci_H6-MYugWyzqRFm362LHiTb1`,
            },
            body: JSON.stringify({ nfc_serial_number: rfid }),
        });
        if (response.ok) {
            const data = await response.json();
            let message = '';
            // Check if the user has clocked in on time
            if (data.event_type === 'start') {
                const theoreticalClockingTime = new Date(data.theoretical_clocking_time);
                const clockedInAt = new Date(data.clocked_in_at);
                if (theoreticalClockingTime.getTime() < clockedInAt.getTime()) {
                    message = `You are late by ${Math.floor(clockedInAt.getTime() - theoreticalClockingTime.getTime()) / 1000 / 60}`;
                }
                else if (theoreticalClockingTime.getTime() > clockedInAt.getTime()) {
                    message = `You are early ${Math.floor(theoreticalClockingTime.getTime() - clockedInAt.getTime()) / 1000 / 60}`;
                }
                else {
                    message = 'You are on time';
                }
            }
            this.notify({
                status: data.event_type,
                data: {
                    display_name: data.user.display_name,
                    avatar_url: data.user.avatar_url,
                    theoretical_clocking_time: data.theoretical_clocking_time,
                    clocked_in_at: data.clocked_in_at,
                    additionalMessage: message,
                },
            });
            this.resetAfter(5000);
        }
        else {
            const data = await response.json();
            this.notify({
                status: 'error',
                additionalMessage: data.message,
                data: null,
            });
            this.resetAfter(5000);
        }
    };
    resetAfter = (time) => {
        setTimeout(() => {
            this.notify({
                status: 'idle',
                data: null,
            });
        }, time);
    };
}
exports.default = ComposalStampRFID;
