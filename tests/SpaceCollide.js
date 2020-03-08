var assert = require('assert');
var ODE = require('../lib/libode.js');
assert(ODE);
ODE.readyPromise.then(function() {
	assert(ODE.ready);
    console.log("ODE API is ready! ");
    var world = new ODE.World();
	var space = new ODE.Space.Hash();
	assert(space);
	var sph1 = ODE.Geom.createSphere(3);
	var sph2 = ODE.Geom.createSphere(3);
	var group = space.createSimpleGroup();
	assert(sph1);
	assert(sph2);
	assert(group);
	sph1.setPosition(-1,0,1);
	sph2.setPosition(1,0,0);
	group.add(sph1);
	group.add(sph2);
	var collide = false;
	space.collide(function(g1,g2)
	{
		collide = true;
	})
	assert(!collide);
	ODE.Geom.collide(sph1,sph2,1,function(contact)
	{
		collide = true;
		console.log(contact);
	});
	assert(collide);
	//console.log(ODE.Geom.getAABB(sph1))
	//console.log(ODE.Geom.getSpaceAABB(sph2))
	console.log('OK !');
});