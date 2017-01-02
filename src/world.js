

    /**************                                   World API                                   *********************/
    var dWorldCreate = Module.cwrap('dWorldCreate','number',[]);
    var dWorldDestroy =  Module.cwrap('dWorldDestroy',null,['number']);
    var dWorldSetGravity = Module.cwrap('dWorldSetGravity',null,['number','number','number','number']);
    var dWorldGetGravity = Module.cwrap('dWorldGetGravity',null,['number','number']);
    var dWorldSetERP = Module.cwrap('dWorldSetERP',null,['number','number']);
    var dWorldGetERP = Module.cwrap('dWorldGetERP','number',['number']);
    var dWorldSetCFM = Module.cwrap('dWorldSetCFM',null,['number','number']);
    var dWorldGetCFM = Module.cwrap('dWorldGetCFM','number',['number']);
    var dWorldSetContactMaxCorrectingVel = Module.cwrap('dWorldSetContactMaxCorrectingVel',null,['number','number']);
    var dWorldGetContactMaxCorrectingVel = Module.cwrap('dWorldGetContactMaxCorrectingVel','number',['number']);
    var dWorldSetContactSurfaceLayer = Module.cwrap('dWorldSetContactSurfaceLayer',null,['number','number']);
    var dWorldGetContactSurfaceLayer = Module.cwrap('dWorldGetContactSurfaceLayer','number',['number']);
    var dWorldStep =  Module.cwrap('dWorldStep',null,['number','number']);

    ODE.World = function ()
    {
        var pointer = arguments[0] || dWorldCreate();
        this.getPointer = function() { return pointer;}
        this.destroy = function() { dWorldDestroy(pointer)}
        this.setGravity = function(x,y,z) {dWorldSetGravity(pointer,x,y,z); return this; }
        this.getGravity = function() {
            dWorldGetGravity(pointer,vec4);
            return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
        }
        Object.defineProperties(this, {
            ERP : {
                enumerable : true,
                get : function(){ return dWorldGetERP(pointer) },
                set : function(val) {  	dWorldSetERP(pointer,val);}
            },
            CFM : {
                enumerable : true,
                get : function(){ return dWorldGetCFM(pointer) },
                set : function(val) {  	 dWorldSetCFM(pointer,val)	}
            },
            ContactMaxCorrectingVel : {
                enumerable : true,
                get : function(){ return dWorldGetContactMaxCorrectingVel(pointer) },
                set : function(val) {  	 dWorldSetContactMaxCorrectingVel(pointer,val)	}
            },
            ContactSurfaceLayer : {
                enumerable : true,
                get : function(){ return dWorldGetContactSurfaceLayer(pointer) },
                set : function(val) {  	 dWorldSetContactSurfaceLayer(pointer,val)	}
            }
        })
        this.step = function(stepsize) { dWorldStep(pointer,stepsize); return this; }
        this.createBody = function() { return new Body(dBodyCreate(pointer));}
        this.createBallJoint = function(group) { return new Joint(dJointCreateBall(pointer, (group)? group.getPointer() : 0)); }
        this.createHingeJoint = function(group) { return new Joint(dJointCreateHinge(pointer, (group)? group.getPointer() : 0)); }
        this.createSliderJoint = function(group) { return new Joint(dJointCreateSlider(pointer, (group)? group.getPointer() : 0)); }
        this.createContactJoint = function( group, contact) {
            return new Joint(dJointCreateContact( pointer, (group)? group.getPointer() : 0, contact.getPointer()));
        }
        this.createHinge2Joint = function(group) { return new Joint(dJointCreateHinge2(pointer, (group)? group.getPointer() : 0)); }
        this.createFixedJoint = function(group) { return new Joint(dJointCreateFixed(pointer, (group)? group.getPointer() : 0)); }
        this.createNullJoint = function(group) { return new Joint(dJointCreateNull(pointer, (group)? group.getPointer() : 0)); }
        this.createAMotorJoint = function(group) { return new Joint(dJointCreateAMotor(pointer, (group)? group.getPointer() : 0)); }
    }