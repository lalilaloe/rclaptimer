const { Board, Proximity } = require("johnny-five");
const board = new Board({
    port: "COM5"
  });

const distance = 20;
let redCarPassed = false;
let redCarTimer;
let blackCarPassed = false;
let blackCarTimer;
const figlet = require('figlet')
const chalk = require('chalk')

function startStopLap(carPassed, carTimer, color = false) {
    if (!carPassed) {
        // if(color){
        //     console.log(chalk.bgRed("Start lap"));
        // }else{
        //     console.log(chalk.black.bgWhite("Start lap"));
        // }   
        carTimer = new Date()
        carPassed = true;
    } else {
        var end = new Date() - carTimer
        if (end > 1000) {
            if(color){
                console.log(chalk.bgRed(figlet.textSync((end / 1000), { horizontalLayout: 'full' })));
            }else{
                console.log(chalk.black.bgWhite(figlet.textSync((end / 1000), { horizontalLayout: 'full' })));
            }            
            carTimer = new Date()
            carPassed = false;
        }
    }
    process.stdout.write("-")
    return { carPassed: carPassed, carTimer: carTimer }
}

board.on("ready", () => {
    console.log("Ready")
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
            const { carPassed, carTimer } = startStopLap(redCarPassed, redCarTimer, true)
            redCarPassed = carPassed;
            redCarTimer = carTimer;
        }
    });

    blackCarSensor.on("change", () => {
        const { centimeters } = blackCarSensor;
        if (centimeters < distance) {
            const { carPassed, carTimer } = startStopLap(blackCarPassed, blackCarTimer)
            blackCarPassed = carPassed;
            blackCarTimer = carTimer;
        }
    });
});