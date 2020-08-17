var ODE = require('bindings')('ode');
var world  = new ODE.World();
//world.gravity = [ 0.,0.,-9.8 ];
console.log(JSON.stringify(world ));