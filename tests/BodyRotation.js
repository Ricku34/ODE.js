var assert = require('assert');
var ODE = require('../lib/libode.js');
assert(ODE);
var world = new ODE.World();
assert(world);
var body = world.createBody();
assert(body);
console.log(body.getQuaternion())
var r= body.getRotation();
assert(r);
r.fromEulerAngles(Math.PI/2,0,0);
console.log(body.getRotation().getArray())
world.step(0.05);
console.log(body.getPosition())
