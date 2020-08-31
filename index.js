const { Board, Proximity } = require("johnny-five");
const board = new Board();

const distance = 20;
let redCar = false;
let redCarTimer;
let blackCar = false;
let blackCarTimer;
const figlet = require('figlet')

function startStopLap(carPassed, carTimer) {
    if (!carPassed) {
        console.log("Start red lap")
        carTimer = new Date()
        carPassed = true;
    } else {
        var end = new Date() - carTimer
        if (end > 1000) {
            console.info('Red car lap time: %dms', end)
            figlet(end / 1000);
            carTimer = new Date()
            carPassed = false;
        }
    }
    console.log("----")
    return { carPassed: carPassed, carTimer: carTimer }
}

board.on("ready", () => {
    const redCarSensor = new Proximity({
        controller: "HCSR04",
        pin: 13
    });

    const blackCarSensor = new Proximity({
        controller: "HCSR04",
        pin: 10
    });

    redCarSensor.on("change", () => {
        const { centimeters } = redCarSensor;
        if (centimeters < distance) {
            const { carPassed, carTimer } = startStopLap(redCar, redCarTimer)
            redCar = carPassed;
            redCarTimer = carTimer;
        }
    });

    blackCarSensor.on("change", () => {
        const { centimeters } = blackCarSensor;
        if (centimeters < distance) {
            const { carPassed, carTimer } = startStopLap(blackCar, blackCarTimer)
            blackCar = carPassed;
            blackCarTimer = carTimer;
        }
    });
});