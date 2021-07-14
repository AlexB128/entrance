//------------------------------------------------------------------------------
//  onoff module emulater
//------------------------------------------------------------------------------
exports.Gpio = function(pinNo, bound) {
  this.pin = pinNo;
  this.value = 0;
};

exports.Gpio.prototype.readSync = function() {
  console.log('[readSync]  PIN: [', this.pin, '] VALUE: [', this.value, ']')
  return this.value;
};

exports.Gpio.prototype.writeSync = function(value) {
  this.value = value;
  console.log('[writeSync] PIN: [', this.pin, '] VALUE: [', value, ']')
  return this.value;
};
