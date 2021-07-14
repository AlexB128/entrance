const onoff = require("onoff");
const Gpio = onoff.Gpio; 

HappyRelay = function (_numberOfPins, _reverse) {
  let reverse = _reverse || false;
  let numberOfPins = (_numberOfPins > 4) ? 4 : _numberOfPins;

  // Keyestudio
  this.ON  = 1;
  this.OFF = 0;
  this.pins = [];

  if (reverse) {
    // Sainsmart requires reverse PIN status
    this.ON  = 0;
    this.OFF = 1;
  }

  const ALL_PINS = [4, 22, 6, 26];
  for (let i = 0; i < numberOfPins; i++) {
    // this.pins.push(ALL_PINS[i]);
    this.pins.push(new Gpio(ALL_PINS[i], 'out'));
  }
};

//------------------------------------------------------------------------------
//  Functions
//------------------------------------------------------------------------------
HappyRelay.prototype.setup = function() {
  console.log('setup: ', this.OFF);
  let action = this.OFF;
  this.pins.forEach(function callback(pin, index, array) {
    pin.writeSync(action);
  });
};
HappyRelay.prototype.destroy = function() {
  console.log('destroy: ', this.OFF);
  let action = this.OFF;
  this.pins.forEach(function callback(pin, index, array) {
    pin.writeSync(action);
  });
};

HappyRelay.prototype.turn = function(index, action) {
  console.log('pin(s): ', index, ' action: ', action);

  if (index instanceof Array) {
    for (let i in index) {
      if (this.pins[index[i]].readSync() !== action)
        this.pins[index[i]].writeSync(action);
    }
  } else {
    if (this.pins[index].readSync() !== action)
      this.pins[index].writeSync(action);
  }
}

HappyRelay.prototype.turnOn = function(index) {
  this.turn(index, this.ON);
};
HappyRelay.prototype.turnOff = function(index) {
  this.turn(index, this.OFF);
};

//------------------------------------------------------------------------------
//  Modules & global variables
//------------------------------------------------------------------------------
// let HappyRelay = require('../lib/HappyRelay').HappyRelay
let relay = new HappyRelay(4, true);

//------------------------------------------------------------------------------
//  Constants
//------------------------------------------------------------------------------
const home = {'latitude': 40.7, 'longitude': -74.3};

const DUSK_RELAY_PIN   = 0;
const SENSOR_RELAY_PIN = 1;

const POLLING_SEC    = 1000
// Wait ON_TIME_SEC seconds after montion sensor light on
const ON_TIME_SEC    = 30000
// Polling interval to check dusk status
const DUSK_TIMER_SEC = 30000

const LIGHTLEVEL_THRESHOLD = 10000;
let sensor = {presence: false, lightlevel: 0};

//------------------------------------------------------------------------------
//  Modules & global variables
//------------------------------------------------------------------------------
let Dusk2Dawn = require('./Dusk2Dawn').Dusk2Dawn;
let d2d = new Dusk2Dawn(home);
let motion = new require('./MotionSensor').motion;

//------------------------------------------------------------------------------
//  Turn On/Off Dusk Light
//------------------------------------------------------------------------------
function duskLight(on) {
  console.log("Dusk Light: ", on);
  on ? relay.turnOn(DUSK_RELAY_PIN) : relay.turnOff(DUSK_RELAY_PIN);
}

//------------------------------------------------------------------------------
//  Turn On/Off Sensor Light
//------------------------------------------------------------------------------
function sensorLight(on) {
  console.log("Sensor Light: ", on);
  on ? relay.turnOn(SENSOR_RELAY_PIN) : relay.turnOff(SENSOR_RELAY_PIN);
}

//------------------------------------------------------------------------------
//  Main
//------------------------------------------------------------------------------
function d2dFunc() {
  let needs = d2d.needsOn();
  console.log('d2dFunc - needsOn: ', needs);
  duskLight(needs);
}

function sensorFunc() {
  motion(sensor);
  console.log('sensorFunc: ', sensor.presence, sensor.lightlevel, LIGHTLEVEL_THRESHOLD);

  let lightOn = sensor.presence && sensor.lightlevel < LIGHTLEVEL_THRESHOLD;
  sensorLight(lightOn)
  setTimeout(sensorFunc, lightOn ? ON_TIME_SEC : POLLING_SEC);
}

relay.setup();
setInterval(d2dFunc, DUSK_TIMER_SEC);   // set interval at the beginning
setTimeout(sensorFunc, POLLING_SEC);    // set interval at the timer event

//------------------------------------------------------------------------------
// Exception Handlers
//------------------------------------------------------------------------------
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log('uncaughtException: ', err)
    relay.destroy();
    process.exit();
})

// Ctrl+C
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    relay.destroy();
    process.exit();
});
