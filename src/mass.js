    /**************                                   Mass API                                   *********************/
    var sizeOfMass = (1+4+4*3)*4;
    var dMassSetZero = Module.cwrap('dMassSetZero',null,['number']);
    var dMassSetParameters = Module.cwrap('dMassSetParameters',null,['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    var dMassSetSphere = Module.cwrap('dMassSetSphere',null,['number', 'number', 'number']);
    var dMassSetSphereTotal = Module.cwrap('dMassSetSphereTotal',null,['number', 'number', 'number']);
    var dMassSetCapsule = Module.cwrap('dMassSetCapsule',null,['number', 'number', 'number', 'number', 'number']);
    var dMassSetCapsuleTotal = Module.cwrap('dMassSetCapsuleTotal',null,['number', 'number', 'number', 'number', 'number']);
    var dMassSetCylinder = Module.cwrap('dMassSetCylinder',null,['number', 'number', 'number', 'number', 'number']);
    var dMassSetCylinderTotal = Module.cwrap('dMassSetCylinderTotal',null,['number', 'number', 'number', 'number', 'number']);
    var dMassSetBox = Module.cwrap('dMassSetBox',null,['number', 'number', 'number', 'number', 'number']);
    var dMassSetBoxTotal = Module.cwrap('dMassSetBoxTotal',null,['number', 'number', 'number', 'number', 'number']);
    var dMassAdjust = Module.cwrap('dMassAdjust',null,['number', 'number']);
    var dMassTranslate = Module.cwrap('dMassTranslate',null,['number', 'number', 'number', 'number']);
    var dMassRotate = Module.cwrap('dMassRotate',null,['number', 'number']);
    var dMassAdd = Module.cwrap('dMassAdd',null,['number', 'number']);
    /**
     * @classdesc The mass parameters of a rigid body
     * @name ODE.Mass
     * @param {Number} [pointer] - heap memory pointer to cast into Mass
     * @class
     */
    ODE.Mass = function ()
    {
        var pointer = arguments[0] ||  Module._malloc(sizeOfMass);

        /**
         * get offset address in heap memory
         * @method ODE.Mass#getPointer
         * @returns {Number}
         */
        this.getPointer = function() { return pointer;}

        /**
         * clear memory space in LLVM heap
         * @method ODE.Mass#destroy
         */
        this.destroy = function() { return Module._free(pointer); }

        /**
         * clear all mass parameters
         * @method ODE.Mass#setZero
         * @returns {ODE.Mass}
         */
        this.setZero = function() { dMassSetZero(pointer); return this;}

        /**
         * fill all mass parameters
         * @method ODE.Mass#setParameters
         * @param {Number} mass - total mass of the rigid body.
         * @param {Number} cgx - center of gravity position in body frame.
         * @param {Number} cgy - center of gravity position in body frame.
         * @param {Number} cgz - center of gravity position in body frame.
         * @param {Number} I11 - 3x3 inertia tensor matrix in body frame.
         * @param {Number} I22 - 3x3 inertia tensor matrix in body frame.
         * @param {Number} I33 - 3x3 inertia tensor matrix in body frame.
         * @param {Number} I12 - 3x3 inertia tensor matrix in body frame.
         * @param {Number} I13 - 3x3 inertia tensor matrix in body frame.
         * @param {Number} I23 - 3x3 inertia tensor matrix in body frame.
         * @returns {ODE.Mass}
         */
        this.setParameters = function( mass,cgx, cgy, cgz, I11, I22, I33, I12, I13, I23) {  dMassSetParameters(pointer, mass,cgx, cgy, cgz, I11, I22, I33, I12, I13, I23); return this;}

        /**
         * Set the mass parameters to represent a sphere of the given radius and density, with the center of mass at (0,0,0) relative to the body.
         * @method ODE.Mass#setSphere
         * @param {Number} density
         * @param {number} radius
         * @returns {ODE.Mass}
         */
        this.setSphere = function(density, radius) { dMassSetSphere(pointer,density, radius); return this;}

        /**
         * Set the mass parameters to represent a sphere of the given radius and mass, with the center of mass at (0,0,0) relative to the body.
         * @method ODE.Mass#setSphereTotal
         * @param {Number} total_mass
         * @param {Number} radius
         * @returns {ODE.Mass}
         */
        this.setSphereTotal = function(total_mass, radius) { dMassSetSphereTotal(pointer,total_mass, radius); return this;}
        /**
         * Set the mass parameters to represent a Capsule of the given parameters and density, with the center of mass at (0,0,0)
         * @method ODE.Mass#setCapsule
         * @param {Number} density
         * @param {Number} direction - The capsule's long axis is oriented along the body's x, y or z axis according to the value of direction (1 = X axis , 2 = Y axis, 3 = Z axis).
         * @param {Number} radius - The radius of the capsule
         * @param {Number} length - The length of the capsule
         * @returns {ODE.Mass}
         */
        this.setCapsule = function(density, direction, a, b) { dMassSetCapsule(pointer, density, direction, a, b); return this;}
        /**
         * Set the mass parameters to represent a Capsule of the given parameters and mass, with the center of mass at (0,0,0)
         * @method ODE.Mass#setCapsuleTotal
         * @param {Number} total_mass
         * @param {Number} direction - The capsule's long axis is oriented along the body's x, y or z axis according to the value of direction (1 = X axis , 2 = Y axis, 3 = Z axis).
         * @param {Number} radius - The radius of the capsule
         * @param {Number} length - The length of the capsule
         * @returns {ODE.Mass}
         */
        this.setCapsuleTotal = function(total_mass, direction, a, b) { dMassSetCapsuleTotal(pointer, total_mass, direction, a, b); return this;}
        this.setCylinder = function(density, direction, a, b) { dMassSetCylinder(pointer, density, direction, a, b); return this;}
        this.setCylinderTotal = function(total_mass, direction, a, b) { dMassSetCylinderTotal(pointer, total_mass, direction, a, b); return this;}
        this.setBox = function(density, lx, ly, lz) { dMassSetBox(pointer, density, lx, ly, lz); return this;}
        this.setBoxTotal = function(total_mass, lx, ly, lz) { dMassSetBoxTotal(pointer, total_mass, lx, ly, lz); return this;}
        this.adjust = function(newmass) { dMassAdjust(pointer, newmass); return this;}
        this.translate = function(x,y,z) {  dMassTranslate(pointer, x,y,z); return this;}
        this.rotate = function(rotation) { dMassRotate(mass, rotation.getPointer()); return this;}
        this.add = function(mass) { dMassAdd(pointer, mass.getPointer()); return this;}
    }