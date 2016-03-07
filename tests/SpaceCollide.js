var assert = require('assert');
var ODE = require('../lib/libode.js');
assert(ODE);
var space = new ODE.Space.Hash();
assert(space);
var sph1 = ODE.Geom.createSphere(3);
var sph2 = ODE.Geom.createSphere(3);
var group = ODE.Geom.createGroup();
assert(sph1);
assert(sph2);
assert(sph2);
sph1.setPosition(-1,0,1);
sph2.setPosition(1,0,0);
group.add(sph1);
group.add(sph2);
var collide = false;
space.collide(function(g1,g2)
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