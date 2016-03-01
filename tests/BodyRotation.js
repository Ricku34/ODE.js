var assert = require('assert');
var ODE = require('../lib/libode.js');
assert(ODE);
var world = ODE.World.create()
assert(world);
var body = ODE.Body.create(world);
assert(body);
console.log(ODE.Body.getQuaternion(body))
var r= ODE.Body.getRotation(body);
assert(r);
r.fromEulerAngles(Math.PI/2,0,0);
ODE.World.step(world,0.05);
//console.log(ODE.Body.getRotation(body).getArray())
console.log(ODE.Body.getQuaternion(body))