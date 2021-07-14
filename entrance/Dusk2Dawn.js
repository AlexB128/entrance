var suncalc = require('suncalc');

exports.Dusk2Dawn = function(home, on_earlier_min, off_at) {
  this.lat  = home['latitude'];
  this.long = home['longitude'];
  this.on_earlier_min = on_earlier_min || 0;
  this.off_at  = off_at || 0;
}

exports.Dusk2Dawn.prototype.needsOn = function(datetime) {
  var now = datetime || new Date();

  var sun = suncalc.getTimes(now, this.lat, this.long);
  console.log('now UTC  : ', now);
  console.log('now local: ', now.toString());
  console.log('sunrise  : ', sun.sunrise.toString());
  console.log('sunset   : ', sun.sunset.toString());

  return (now >= sun.sunset && now.getHours() > 16) ? true : false;
}

// var d2d = new exports.Dusk2Dawn({'latitude': 40.7, 'longitude': -74.3});
// console.log('needsOn: ', d2d.needsOn());
