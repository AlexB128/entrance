const HappyRelay = require('../lib/HappyRelay').HappyRelay;

let relay1 = new HappyRelay(1, true);
console.log(relay1);
let relay2 = new HappyRelay(2);
console.log(relay2);
let relay3 = new HappyRelay(3, false);
console.log(relay3);
let relay4 = new HappyRelay(4);
console.log(relay4);

// console.log(relay1.setup());
console.log(relay4.setup());
console.log(relay4.turnOn(0));
console.log(relay4.turnOff([1, 3]));
console.log(relay4.turnOn(2));
console.log(relay4.destroy());
