// 'use strict'
//------------------------------------------------------------------------------
//  Relay module
//------------------------------------------------------------------------------
// const Gpio = (process.env.NODE_ENV === 'simulator') ? require('../lib/onoff').Gpio : require('onoff').Gpio; //include onoff to interact with the GPIO
const onoff = require("onoff");
const Gpio = onoff.Gpio; 

exports.HappyRelay = function (_numberOfPins, _reverse) {
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
exports.HappyRelay.prototype.setup = function() {
  console.log('setup: ', this.OFF);
  let action = this.OFF;
  this.pins.forEach(function callback(pin, index, array) {
    pin.writeSync(action);
  });
};
exports.HappyRelay.prototype.destroy = function() {
  console.log('destroy: ', this.OFF);
  let action = this.OFF;
  this.pins.forEach(function callback(pin, index, array) {
    pin.writeSync(action);
  });
};

exports.HappyRelay.prototype.turn = function(index, action) {
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

exports.HappyRelay.prototype.turnOn = function(index) {
  this.turn(index, this.ON);
};
exports.HappyRelay.prototype.turnOff = function(index) {
  this.turn(index, this.OFF);
};
