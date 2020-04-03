
var ODE = require('../lib/libode.js');
ODE.readyPromise.then(function() {
   var world = new ODE.World();
   var space = new ODE.Space.Hash();
   console.assert(world && space);
 
   var sph1 = ODE.Geom.createSphere(3);
   var sph2 = ODE.Geom.createSphere(3);
   sph1.name = "sphere 1";
   sph2.name = "sphere 2";
   
  
   var body = world.createBody();
   sph1.setBody(body);
   console.assert(sph1.getBody()===body);
  
   sph1.setPosition(-1,0,1);
   sph2.setPosition(1,0,0);
   space.add(sph1);
   space.add(sph2);
  
   space.collide(function(g1,g2)
   {
       console.log('Collide ', g1.name, g2.name);
   })
});
