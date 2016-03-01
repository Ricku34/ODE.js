var assert = require('assert');
var ODE = require('../lib/libode.js');
assert(ODE);
var space = ODE.Space.createHash()
assert(space);
var sph1 = ODE.Geom.createSphere(space,3);
var sph2 = ODE.Geom.createSphere(space,3);
assert(sph1);
assert(sph2);
ODE.Geom.setPosition(sph1,-1,0,1);
ODE.Geom.setPosition(sph2,1,0,0);
var collide = false;
ODE.Space.collide(space,function(data,g1,g2)
{
	collide = true;
	ODE.Geom.collide(g1,g2,6,function(contact)
	{
		console.log(contact);
	});
})
assert(collide);
//console.log(ODE.Geom.getAABB(sph1))
//console.log(ODE.Geom.getSpaceAABB(sph2))
console.log('OK !');