

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
    var dBodyAddForceAtPos = Module.cwrap('dBodyAddForceAtPos',null,['number','number','number','number','number','number','number']);
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

    /**
     * @name ODE.Body
     * @classdesc Control of an object's position through physics simulation
     * @abstract
     * @class
     */
    function Body(pointer)
    {
        if(!javascriptHeap[pointer]) {
            javascriptHeap[pointer] = this;
        }

        /**
         * get offset address in heap memory
         * @method ODE.Body#getPointer
         * @returns {Number}
         */
        this.getPointer = function() { return pointer;}

        /**
         * clear memory space in LLVM heap
         * @method ODE.Body#destroy
         */
        this.destroy = function() { dBodyDestroy(pointer)}
        /**
         * set the position of the body
         * @method ODE.Body#setPosition
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         * @returns {ODE.Body}
         */
        this.setPosition = function(x,y,z) { dBodySetPosition(pointer,x,y,z); return this; }
        /**
         * set the rotation of the body by a Matrix3x3
         * @method ODE.Body#setRotation
         * @param {ODE.Rotation} rotation
         * @returns {ODE.Body}
         */
        this.setRotation = function(rotation) { dBodySetRotation(pointer, rotation.getPointer()); return this;}
        /**
         * set the rotation of the body by a quaternion
         * @method ODE.Body#setQuaternion
         * @param {ODE.Quaternion} quat
         * @returns {ODE.Body}
         */
        this.setQuaternion = function(quat) {	dBodySetQuaternion(pointer,quat.getPointer()); return this;}
        /**
         * set the linear velocity of the body by a vector
         * @method ODE.Body#setLinearVel
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         * @returns {ODE.Body}
         */
        this.setLinearVel = function(x,y,z) { dBodySetLinearVel(pointer,x,y,z); return this; }
        /**
         * set the angular velocity of the body by a vector
         * @method ODE.Body#setAngularVel
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         * @returns {ODE.Body}
         */
        this.setAngularVel = function(x,y,z) { dBodySetAngularVel(pointer,x,y,z); return this; }

        /**
         * get the position of the body.
         * @method ODE.Body#getPosition
         * @returns {Float32Array} 3d position [x, y, z]
         */
        this.getPosition = function()
        {
            var p = dBodyGetPosition(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        /**
         * get the rotation of the body in Matrix3x3.
         * @method ODE.Body#getRotation
         * @returns {ODE.Rotation}
         */
        this.getRotation = function()
        {
            var p = dBodyGetRotation(pointer);
            return (p)? ((!javascriptHeap[p])? new ODE.Rotation(p): javascriptHeap[p] ): null;
        }

        /**
         * get the rotation of the body in quaternion.
         * @method ODE.Body#getQuaternion
         * @returns {ODE.Quaternion}
         */
        this.getQuaternion = function()
        {
            var p = dBodyGetQuaternion(pointer);
            return (p)? ((!javascriptHeap[p])? new ODE.Quaternion(p): javascriptHeap[p] ): null;
        }

        /**
         * get the linear velocity of the body.
         * @method ODE.Body#getLinearVel
         * @returns {Float32Array} 3d Vector [x, y, z]
         */
        this.getLinearVel = function()
        {
            var p = dBodyGetLinearVel(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        /**
         * get the angular velocity of the body.
         * @method ODE.Body#getAngularVel
         * @returns {Float32Array} 3d Vector [x, y, z]
         */
        this.getAngularVel = function()
        {
            var p = dBodyGetAngularVel(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        /**
         * set the mass of the body
         * @method ODE.Body#setMass
         * @param {ODE.Mass} mass
         * @returns {ODE.Body}
         */
        this.setMass = function(mass) {	dBodySetMass(pointer,mass.getPointer()); return this;}
        /**
         * get a new instance of mass of the body (don't forget to destroy it)
         * @method ODE.Body#getMass
         * @returns {ODE.Mass}
         */
        this.getMass = function()
        {
            var pmass = Module._malloc(sizeOfMass);
            dBodyGetMass(pointer,pmass)
            return new ODE.Mass(pmass);
        }

        /**
         * @method ODE.Body#addForce
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @returns {ODE.Body}
         */
        this.addForce = function( fx, fy, fz)   {	dBodyAddForce(pointer,fx, fy, fz); return this;}
        /**
         * @method ODE.Body#addTorque
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @returns {ODE.Body}
         */
        this.addTorque  = function( fx, fy, fz)   { dBodyAddTorque(pointer,fx, fy, fz); return this;}
        /**
         * @method ODE.Body#addRelForce
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @returns {ODE.Body}
         */
        this.addRelForce  = function( fx, fy, fz) {	dBodyAddRelForce(pointer,fx, fy, fz); return this;}
        /**
         * @method ODE.Body#addRelTorque
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @returns {ODE.Body}
         */
        this.addRelTorque = function( fx, fy, fz) {	dBodyAddRelTorque(pointer,fx, fy, fz); return this;}
        /**
         * @method ODE.Body#addForceAtPos
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @param {Number} px
         * @param {Number} py
         * @param {Number} pz
         * @returns {ODE.Body}
         */
        this.addForceAtPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddForceAtPos(pointer,fx, fy, fz, px, py, pz); return this;}
        /**
         * @method ODE.Body#addForceAtRelPos
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @param {Number} px
         * @param {Number} py
         * @param {Number} pz
         * @returns {ODE.Body}
         */
        this.addForceAtRelPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddForceAtRelPos(pointer,fx, fy, fz, px, py, pz); return this;}
        /**
         * @method ODE.Body#addRelForceAtPos
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @param {Number} px
         * @param {Number} py
         * @param {Number} pz
         * @returns {ODE.Body}
         */
        this.addRelForceAtPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddRelForceAtPos(pointer,fx, fy, fz, px, py, pz); return this;}
        /**
         * @method ODE.Body#addRelForceAtRelPos
         * @param {Number} fx
         * @param {Number} fy
         * @param {Number} fz
         * @param {Number} px
         * @param {Number} py
         * @param {Number} pz
         * @returns {ODE.Body}
         */
        this.addRelForceAtRelPos = function( fx, fy, fz, px, py, pz){	dBodyAddRelForceAtRelPos(pointer,fx, fy, fz, px, py, pz); return this;}

        /**
         * get the current accumulated force vector
         * @method ODE.Body#getForce
         * @returns {Float32Array} 3d Vector [x, y, z]
         */
        this.getForce = function()
        {
            var p = dBodyGetForce(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        /**
         * get the current accumulated torque vector
         * @method ODE.Body#getTorque
         * @returns {Float32Array} 3d Vector [x, y, z]
         */
        this.getTorque = function()
        {
            var p = dBodyGetTorque(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        /**
         *
         * @method ODE.Body#getRelPointPos
         * @returns {Array<Number>} 3d Position [x, y, z]
         */
        this.getRelPointPos = function( px, py, pz) {
            dBodyGetRelPointPos(pointer, px, py, pz, vec4);
            return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
        }

        /**
         *
         * @method ODE.Body#getRelPointVel
         * @returns  {Array<Number>} 3d Vector [x, y, z]
         */
        this.getRelPointVel = function( px, py, pz) {
            dBodyGetRelPointVel(pointer, px, py, pz, vec4);
            return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
        }

        /**
         * @method ODE.Body#enable
         * @returns {ODE.Body}
         */
        this.enable = function() { dBodyEnable(pointer); return this; }
        /**
         * @method ODE.Body#disable
         * @returns {ODE.Body}
         */
        this.disable = function() { dBodyDisable(pointer); return this; }
        /**
         * @method ODE.Body#isEnabled
         * @returns {Boolean}
         */
        this.isEnabled = function() { return dBodyIsEnabled(pointer);  }

        this.getNumJoints = function() { return dBodyGetNumJoints(pointer);  }
        this.getJoint = function(idx)
        {
            var j = dBodyGetJoint(pointer,idx);
            return (j)? ((!javascriptHeap[j])? new Joint(j): javascriptHeap[b] ) : null;
        }

    }
    ODE.Body = {
        /**
         * @static
         * @function ODE.Body.areConnected
         * @param {ODE.Body} b1
         * @param {ODE.Body} b2
         * @returns {Boolean} return true if the two bodies are connected together by a joint
         */
        areConnected : function(b1,b2) {
            return dAreConnected((b1)? b1.getPointer() : 0, (b2)? b2.getPointer() : 0 );
        }
    };