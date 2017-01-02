

    /**************                                   Body API                                   *********************/
    var dBodyCreate = Module.cwrap('dBodyCreate','number',['number']);
    var dBodyDestroy = Module.cwrap('dBodyDestroy',null,['number']);
    var dBodySetPosition = Module.cwrap('dBodySetPosition',null,['number','number','number','number']);
    var dBodySetLinearVel = Module.cwrap('dBodySetLinearVel',null,['number','number','number','number']);
    var dBodySetAngularVel = Module.cwrap('dBodySetAngularVel',null,['number','number','number','number']);
    var dBodySetRotation = Module.cwrap('dBodySetRotation',null,['number','number']);
    var dBodySetQuaternion = Module.cwrap('dBodySetQuaternion',null,['number','number']);
    var dBodyGetPosition = Module.cwrap('dBodyGetPosition','number',['number']);
    var dBodyGetRotation = Module.cwrap('dBodyGetRotation','number',['number']);
    var dBodyGetQuaternion = Module.cwrap('dBodyGetQuaternion','number',['number']);
    var dBodyGetLinearVel = Module.cwrap('dBodyGetLinearVel','number',['number']);
    var dBodyGetAngularVel = Module.cwrap('dBodyGetAngularVel','number',['number']);
    var dBodySetMass = Module.cwrap('dBodySetMass',null,['number','number']);
    var dBodyGetMass = Module.cwrap('dBodyGetMass',null,['number','number']);
    var dBodyAddForce = Module.cwrap('dBodyAddForce',null,['number','number','number','number']);
    var dBodyGetForce = Module.cwrap('dBodyGetForce','number',['number']);
    var dBodyAddTorque = Module.cwrap('dBodyAddTorque',null,['number','number','number','number']);
    var dBodyGetTorque = Module.cwrap('dBodyGetTorque','number',['number']);
    var dBodyAddRelForce = Module.cwrap('dBodyAddRelForce',null,['number','number','number','number']);
    var dBodyAddRelTorque = Module.cwrap('dBodyAddRelTorque',null,['number','number','number','number']);
    var dBodyAddForcAtPos = Module.cwrap('dBodyAddForceAtPos',null,['number','number','number','number','number','number','number']);
    var dBodyAddForceAtRelPos = Module.cwrap('dBodyAddForceAtRelPos',null,['number','number','number','number','number','number','number']);
    var dBodyAddRelForceAtPos = Module.cwrap('dBodyAddRelForceAtPos',null,['number','number','number','number','number','number','number']);
    var dBodyAddRelForceAtRelPos = Module.cwrap('dBodyAddRelForceAtRelPos',null,['number','number','number','number','number','number','number']);
    var dBodyGetRelPointPos = Module.cwrap('dBodyGetRelPointPos',null,['number','number','number','number','number']);
    var dBodyGetRelPointVel = Module.cwrap('dBodyGetRelPointVel',null,['number','number','number','number','number']);
    var dBodyEnable = Module.cwrap('dBodyEnable',null,['number']);
    var dBodyDisable = Module.cwrap('dBodyDisable',null,['number']);
    var dBodyIsEnabled = Module.cwrap('dBodyIsEnabled','number',['number']);
    var dBodyGetNumJoints = Module.cwrap('dBodyGetNumJoints','number',['number']);
    var dBodyGetJoint = Module.cwrap('dBodyGetJoint','number',['number','number']);
    var dAreConnected = Module.cwrap('dAreConnected','number',['number','number']);

    function Body(pointer)
    {
        this.getPointer = function() { return pointer;}
        this.destroy = function() { dBodyDestroy(pointer)}
        this.setPosition = function(x,y,z) { dBodySetPosition(pointer,x,y,z); return this; }
        this.setRotation = function(rotation) { dBodySetRotation(pointer, rotation.getPointer()); return this;}
        this.setQuaternion = function(quat) {	dBodySetQuaternion(pointer,quat.getPointer()); return this;}
        this.setLinearVel = function(x,y,z) { dBodySetLinearVel(pointer,x,y,z); return this; }
        this.setAngularVel = function(x,y,z) { dBodySetAngularVel(pointer,x,y,z); return this; }

        this.getPosition = function()
        {
            var p = dBodyGetPosition(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        this.getRotation = function()
        {
            return new ODE.Rotation(dBodyGetRotation(pointer));
        }

        this.getQuaternion = function()
        {
            return new ODE.Quaternion(dBodyGetQuaternion(pointer));
        }

        this.getLinearVel = function()
        {
            var p = dBodyGetLinearVel(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        this.getAngularVel = function()
        {
            var p = dBodyGetAngularVel(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        this.setMass = function(mass) {	dBodySetMass(pointer,mass.getPointer()); return this;}
        this.getMass = function(body)
        {
            dBodyGetMass(body,mass)
            return new ODE.Mass(mass);
        }

        this.addForce = function( fx, fy, fz)   {	dBodyAddForce(pointer,fx, fy, fz); return this;}
        this.addTorque  = function( fx, fy, fz)   { dBodyAddTorque(pointer,fx, fy, fz); return this;}
        this.addRelForce  = function( fx, fy, fz) {	dBodyAddRelForce(pointer,fx, fy, fz); return this;}
        this.addRelTorque = function( fx, fy, fz) {	dBodyAddRelTorque(pointer,fx, fy, fz); return this;}

        this.addForceAtPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddForceAtPos(pointer,fx, fy, fz, px, py, pz); return this;}
        this.addForceAtRelPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddForceAtRelPos(pointer,fx, fy, fz, px, py, pz); return this;}
        this.addRelForceAtPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddRelForceAtPos(pointer,fx, fy, fz, px, py, pz); return this;}
        this.addRelForceAtRelPos = function( fx, fy, fz, px, py, pz){	dBodyAddRelForceAtRelPos(pointer,fx, fy, fz, px, py, pz); return this;}

        this.getForce = function()
        {
            var p = dBodyGetForce(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        this.getTorque = function()
        {
            var p = dBodyGetTorque(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        this.getRelPointPos = function( px, py, pz) {
            dBodyGetRelPointPos(pointer, px, py, pz, vec4);
            return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
        }

        this.getRelPointVel = function( px, py, pz) {
            dBodyGetRelPointVel(pointer, px, py, pz, vec4);
            return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
        }

        this.enable = function() { dBodyEnable(pointer); return this; }
        this.disable = function() { dBodyDisable(pointer); return this; }
        this.isEnabled = function() { return dBodyIsEnabled(pointer);  }

        this.getNumJoints = function() { return dBodyGetNumJoints(pointer);  }
        this.getJoint = function(idx)
        {
            var j = dBodyGetJoint(pointer,idx);
            return (j)? new Joint() : null;
        }

    }
    ODE.Body = { areConnected : function(b1,b2) { return dAreConnected((b1)? b1.getPointer() : 0, (b2)? b2.getPointer() : 0 ); } };