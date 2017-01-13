    var ODE = {};

    var vec4 = Module._malloc(4*4);
    var mat3 = Module._malloc(4*3*4);
    var mass = Module._malloc((1+4+4*3)*4);
    var vec6 = Module._malloc(6*4);
    function setVec4(vec)
    {
        for(var i=0;i<4;i++)
            Module.setValue(vec4+i*4, vec[i], 'float');
        return vec4;
    }

    function setMat3(mat)
    {
        for(var i=0;i<12;i++)
            Module.setValue(mat3+i*4, mat[i], 'float');
        return mat3;
    }


    function getVec6()
    {
        var mat = new Array(6);
        for(var i=0;i<6;i++)
            mat[i] = Module.getValue(vec6+i*4, 'float');
        return mat;
    }

    /**************                                   Rotation  API                                   *********************/
    var sizeOfRotation = 4*3*4;
    var dRSetIdentity = Module.cwrap('dRSetIdentity',null,['number']);
    var dRFromAxisAndAngle = Module.cwrap('dRFromAxisAndAngle',null,['number', 'number', 'number', 'number', 'number']);
    var dRFromEulerAngles = Module.cwrap('dRFromEulerAngles',null,['number', 'number', 'number', 'number']);
    var dRFrom2Axes = Module.cwrap('dRFrom2Axes',null,['number', 'number', 'number', 'number', 'number', 'number', 'number']);

    /**
     * @classdesc 3x3 rotation matrix
     * @name ODE.Rotation
     * @param {Number} [pointer] - heap memory pointer to cast into Rotation
     * @class
     */
    ODE.Rotation = function()
    {
        var pointer = arguments[0] ||  Module._malloc(sizeOfRotation);
        /**
         * get offset address in heap memory
         * @method ODE.Rotation#getPointer
         * @returns {Number}
         */
        this.getPointer = function() { return pointer;};

        /**
         * Set matrix to the identity (i.e. no rotation).
         * @method ODE.Rotation#setIdentity
         * @returns {ODE.Rotation}
         */
        this.setIdentity = function() { dRSetIdentity(pointer); return this; };

        /**
         * Fill the 3x3 matrix
         * @method ODE.Rotation#setArray
         * @param {Array<Number>|Float32Array} mat
         * @returns {ODE.Rotation}
         */
        this.setArray = function (mat)
        {
            for(var i=0;i<12;i++)
                Module.setValue(pointer+i*4, mat[i], 'float');
            return this;
        }
        /**
         * get copy of the 3x3 matrix
         * @method ODE.Rotation#getArray
         * @returns {Float32Array}
         */
        this.getArray = function()
        {
            return Module.HEAPF32.slice(pointer/4,pointer/4+12);
        }

        /**
         * Compute the rotation matrix as a rotation of angle radians along the axis (ax,ay,az).
         * @method ODE.Rotation#fromAxisAndAngle
         * @param {Number} ax
         * @param {Number} ay
         * @param {Number} az
         * @param {Number} angle angle in radian
         * @returns {ODE.Rotation}
         */
        this.fromAxisAndAngle = function ( ax, ay, az, angle) { dRFromAxisAndAngle(pointer, ax, ay, az, angle); return this; }
        /**
         * Compute the rotation matrix from the three Euler rotation angles in radians.
         * @method ODE.Rotation#fromEulerAngles
         * @param phi
         * @param theta
         * @param psi
         * @returns {ODE.Rotation}
         */
        this.fromEulerAngles  = function ( phi, theta, psi)  { dRFromEulerAngles(pointer, phi, theta, psi); return this; }
    }

    /**************                                   Quaternion API                                   *********************/
    var sizeOfQuaternion = 4*4;
    var dQSetIdentity = Module.cwrap('dQSetIdentity',null,['number']);
    var dQFromAxisAndAngle = Module.cwrap('dQFromAxisAndAngle',null,['number', 'number', 'number', 'number', 'number']);

    /**
     * @classdesc  A quaternion is four numbers [cos( theta /2),sin( theta /2)*u] where theta is a rotation angle and u is a unit length rotation axis.
     * @name ODE.Quaternion
     * @param {Number} [pointer] - heap memory pointer to cast into ODE.Quaternion
     * @class
     */
    ODE.Quaternion = function()
    {
        var pointer = arguments[0] ||  Module._malloc(sizeOfQuaternion);

        /**
         * get offset address in heap memory
         * @method ODE.Quaternion#getPointer
         * @returns {Number}
         */
        this.getPointer = function() { return pointer;};

        /**
         * Set quaternion to the identity (i.e. no rotation).
         * @method ODE.Quaternion#setIdentity
         * @returns {ODE.Quaternion}
         */
        this.setIdentity = function() { dQSetIdentity(pointer); return this; };

        /**
         * Fill the quaternion
         * @method ODE.Quaternion#setArray
         * @param {Array<Number>|Float32Array} quat
         * @returns {ODE.Quaternion}
         */
        this.setArray = function (quat)
        {
            for(var i=0;i<4;i++)
                Module.setValue(pointer+i*4, quat[i], 'float');
            return this;
        }
        /**
         * get copy of the 4 values of quaternion
         * @method ODE.Quaternion#getArray
         * @returns {Float32Array}
         */
        this.getArray = function(geom)
        {
            return Module.HEAPF32.slice(pointer/4,pointer/4+4);
        }

        /**
         * Compute the quaternion as a rotation of angle radians along the axis (ax,ay,az).
         * @method ODE.Quaternion#fromAxisAndAngle
         * @param {Number} ax
         * @param {Number} ay
         * @param {Number} az
         * @param {Number} angle angle in radian
         * @returns {ODE.Quaternion}
         */
        this.fromAxisAndAngle = function ( ax, ay, az, angle) { dQFromAxisAndAngle(pointer, ax, ay, az, angle); return this; }
    }
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
     * @param {Number} [pointer] - heap memory pointer to cast into Rotation
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


    /**************                                   Joint API                                   *********************/
    var dJointGroupCreate = Module.cwrap('dJointGroupCreate','number',['number'])
    var dJointGroupDestroy = Module.cwrap('dJointGroupDestroy',null,['number']);
    var dJointGroupEmpty = Module.cwrap('dJointGroupEmpty',null,['number']);

    /**
     * @namespace ODE.Joint
     */
    ODE.Joint = {

        /**
         * enumerate all types of joints
         * @namespace ODE.Joint.Types
         */
        Types : {
            /**
             *
             * @name ODE.Joint.Types#Unknown
             */
            Unknown 	: 0,

            /**
             * A ball and socket joint between 2 rigid bodies :  ![Ball and Socket](http://ode.org/pix/ball-and-socket.jpg)
             * @name ODE.Joint.Types#Ball
             */
            Ball 		: 1,

            /**
             * A hinge joint between 2 rigid bodies ![Hinge](http://ode.org/pix/hinge.jpg)
             * @name ODE.Joint.Types#Hinge
             */
            Hinge 		: 2,

            /**
             * A Slider joint between 2 rigid bodies![Slider](http://ode.org/pix/slider.jpg)
             * @name ODE.Joint.Types#Slider
             */
            Slider 		: 3,

            /**
             * A Contact joint between 2 rigid bodies or an rigid body and {ODE.Geom} collider  ![Contact](http://ode.org/pix/contact.jpg)
             * @name ODE.Joint.Types#Contact
             */
            Contact		: 4,

            /**
             * A Universal joint between 2 rigid bodies ![Universal](http://ode.org/pix/universal.jpg)
             * @name ODE.Joint.Types#Universal
             */
            Universal 	: 5,

            /**
             * A Hinge2 joint between 2 rigid bodies ![Hinge2](http://ode.org/pix/hinge2.jpg)
             * @name ODE.Joint.Types#Hinge2
             */
            Hinge2 		: 6,

            /**
             * A Fixed joint between 2 rigid bodies (zero liberties between them).
             * The fixed joint maintains a fixed relative position and orientation between two bodies, or between a body and the static environment. Using this joint is almost never a good idea in practice, except when debugging. If you need two bodies to be glued together it is better to represent that as a single body.
             * @name ODE.Joint.Types#Fixed
             */
            Fixed		: 7,

            /**
             * A Null joint between 2 rigid bodies (full liberties between them).
             * @name ODE.Joint.Types#Null
             */
            Null 		: 8,

            /**
             * An Angular Motor joint between 2 rigid bodies ![AMotor](http://ode.org/pix/amotor.jpg)
             * An angular motor (AMotor) allows the relative angular velocities of two bodies to be controlled.
             * @name ODE.Joint.Types#AMotor
             */
            AMotor 		: 9,
            LMotor		: 10,
            Plane2D		: 11
        },

        /**
         * enumerate all parameter of joints that extend {@link ODE.Joint.Prototypes.ParametersJoint}
         * @namespace ODE.Joint.Parameters
         */
        Parameters : {
            /**
             * Low stop angle or position. Setting this to -Infinity (the default value) turns off the low stop. For rotational joints, this stop must be greater than -pi to be effective.
             * @name ODE.Joint.Parameters#LoStop
             */
            LoStop				: 0,
            /**
             * High stop angle or position. Setting this to Infinity (the default value) turns off the high stop. For rotational joints, this stop must be less than pi to be effective. If the high stop is less than the low stop then both stops will be ineffective.
             * @name ODE.Joint.Parameters#HiStop
             */
            HiStop				: 1,
            /**
             * Desired motor velocity (this will be an angular or linear velocity).
             * @name ODE.Joint.Parameters#Vel
             */
            Vel					: 2,
            /**
             * The maximum force or torque that the motor will use to achieve the desired velocity. This must always be greater than or equal to zero. Setting this to zero (the default value) turns off the motor.
             * @name ODE.Joint.Parameters#FMax
             */
            FMax				: 3,
            /**
             * The current joint stop/motor implementation has a small problem: when the joint is at one stop and the motor is set to move it away from the stop, too much force may be applied for one time step, causing a ``jumping'' motion. This fudge factor is used to scale this excess force. It should have a value between zero and one (the default value). If the jumping motion is too visible in a joint, the value can be reduced. Making this value too small can prevent the motor from being able to move the joint away from a stop.
             * @name ODE.Joint.Parameters#FudgeFactor
             */
            FudgeFactor			: 4,
            /**
             * The bouncyness of the stops. This is a restitution parameter in the range 0..1. 0 means the stops are not bouncy at all, 1 means maximum bouncyness.
             * @name ODE.Joint.Parameters#Bounce
             */
            Bounce				: 5,
            /**
             * The error reduction parameter (ERP) used by the stops.
             * @name ODE.Joint.Parameters#StopERP
             */
            StopERP				: 6,
            /**
             * The constraint force mixing (CFM) value used by the stops. Together with the ERP value this can be used to get spongy or soft stops. Note that this is intended for unpowered joints, it does not really work as expected when a powered joint reaches its limit.
             * @name ODE.Joint.Parameters#StopCFM
             */
            StopCFM				: 7,
            /**
             * Suspension error reduction parameter (ERP). Currently this is only implemented on the hinge-2 joint.
             * @name ODE.Joint.Parameters#SuspensionERP
             */
            SuspensionERP		: 8,
            /**
             * Suspension constraint force mixing (CFM) value. Currently this is only implemented on the hinge-2 joint.
             * @name ODE.Joint.Parameters#SuspensionCFM
             */
            SuspensionCFM		: 9,

            LoStop2				: 0x100 + 0,
            HiStop2				: 0x100 + 1,
            Vel2				: 0x100 + 2,
            FMax2				: 0x100 + 3,
            FudgeFactor2		: 0x100 + 4,
            Bounce2				: 0x100 + 5,
            StopERP2			: 0x100 + 6,
            StopCFM2			: 0x100 + 7,
            SuspensionERP2		: 0x100 + 8,
            SuspensionCFM2		: 0x100 + 9,

            LoStop3				: 0x200 + 0,
            HiStop3				: 0x200 + 1,
            Vel3				: 0x200 + 2,
            FMax3				: 0x200 + 3,
            FudgeFactor3		: 0x200 + 4,
            Bounce3				: 0x200 + 5,
            StopERP3			: 0x200 + 6,
            StopCFM3			: 0x200 + 7,
            SuspensionERP3		: 0x200 + 8,
            SuspensionCFM3		: 0x200 + 9
        },

        AMotorModes : {
            User : 0,
            Euler : 1
        },

        /**
         * @classdesc A collection of Joints
         * @name ODE.Joint.Group
         * @param {number} max_size
         * @class
         */
        Group : function(max_size)
        {
            var pointer = dJointGroupCreate(max_size);
            /**
             * get offset address in heap memory
             * @method ODE.Joint.Group#getPointer
             * @returns {Number}
             */
            this.getPointer = function() { return pointer;}
            /**
             * clear memory space in LLVM heap
             * @method ODE.Joint.Group#destroy
             */
            this.destroy = function() { dJointDestroy(pointer)}
            /**
             * Empty a joint group. All joints in the joint group will be destroyed, but the joint group itself will not be destroyed.
             * @method ODE.Joint.Group#empty
             * @returns {ODE.Joint.Group}
             */
            this.empty = function() { dJointGroupEmpty(pointer); return this}
        }
    };
    var dJointCreateBall = Module.cwrap('dJointCreateBall','number',['number', 'number']);
    var dJointCreateHinge = Module.cwrap('dJointCreateHinge','number',['number', 'number']);
    var dJointCreateSlider = Module.cwrap('dJointCreateSlider','number',['number', 'number']);
    var dJointCreateContact = Module.cwrap('dJointCreateContact','number',['number', 'number' , 'number']);
    var dJointCreateUniversal = Module.cwrap('dJointCreateUniversal','number',['number', 'number']);
    var dJointCreateHinge2 = Module.cwrap('dJointCreateHinge2','number',['number', 'number']);
    var dJointCreateFixed = Module.cwrap('dJointCreateFixed','number',['number', 'number']);
    var dJointCreateNull = Module.cwrap('dJointCreateNull','number',['number', 'number']);
    var dJointCreateAMotor = Module.cwrap('dJointCreateAMotor','number',['number', 'number']);
    var dJointDestroy = Module.cwrap('dJointDestroy',null,['number']);
    var dJointAttach = Module.cwrap('dJointAttach',null,['number', 'number' , 'number']);
    var dJointGetType = Module.cwrap('dJointGetType','number',['number']);
    var dJointGetBody = Module.cwrap('dJointGetBody','number',['number', 'number']);
    var dJointSetBallAnchor = Module.cwrap('dJointSetBallAnchor',null,['number','number','number','number']);
    var dJointGetBallAnchor = Module.cwrap('dJointGetBallAnchor',null,['number','number']);
    var dJointSetHingeAnchor = Module.cwrap('dJointSetHingeAnchor',null,['number','number','number','number']);
    var dJointGetHingeAnchor = Module.cwrap('dJointGetHingeAnchor',null,['number','number']);
    var dJointSetHingeAxis = Module.cwrap('dJointSetHingeAxis',null,['number','number','number','number']);
    var dJointGetHingeAxis = Module.cwrap('dJointGetHingeAxis',null,['number','number']);
    var dJointSetHingeParam = Module.cwrap('dJointSetHingeParam',null,['number','number','number']);
    var dJointGetHingeParam = Module.cwrap('dJointGetHingeParam','number',['number', 'number']);
    var dJointGetHingeAngle = Module.cwrap('dJointGetHingeAngle','number',['number']);
    var dJointGetHingeAngleRate = Module.cwrap('dJointGetHingeAngleRate','number',['number']);
    var dJointSetSliderAxis = Module.cwrap('dJointSetSliderAxis',null,['number','number','number','number']);
    var dJointGetSliderAxis = Module.cwrap('dJointGetSliderAxis',null,['number','number']);
    var dJointSetSliderParam = Module.cwrap('dJointSetSliderParam',null,['number','number','number']);
    var dJointGetSliderParam = Module.cwrap('dJointGetSliderParam','number',['number', 'number']);
    var dJointGetSliderPosition = Module.cwrap('dJointGetSliderPosition','number',['number']);
    var dJointGetSliderPositionRate = Module.cwrap('dJointGetSliderPositionRate','number',['number']);
    var dJointSetUniversalAnchor = Module.cwrap('dJointSetUniversalAnchor',null,['number','number','number','number']);
    var dJointSetUniversalAxis1 = Module.cwrap('dJointSetUniversalAxis1',null,['number','number','number','number']);
    var dJointSetUniversalAxis2 = Module.cwrap('dJointSetUniversalAxis2',null,['number','number','number','number']);
    var dJointSetUniversalParam = Module.cwrap('dJointSetUniversalParam',null,['number','number','number']);
    var dJointGetUniversalAnchor = Module.cwrap('dJointGetUniversalAnchor',null,['number','number']);
    var dJointGetUniversalAnchor2 = Module.cwrap('dJointGetUniversalAnchor2',null,['number','number']);
    var dJointGetUniversalAxis1 = Module.cwrap('dJointGetUniversalAxis1',null,['number','number']);
    var dJointGetUniversalAxis2 = Module.cwrap('dJointGetUniversalAxis2',null,['number','number']);
    var dJointGetUniversalParam = Module.cwrap('dJointGetUniversalParam','number',['number', 'number']);
    var dJointGetUniversalAngle1 = Module.cwrap('dJointGetUniversalAngle1','number',['number']);
    var dJointGetUniversalAngle2 = Module.cwrap('dJointGetUniversalAngle2','number',['number']);
    var dJointGetUniversalAngle1Rate = Module.cwrap('dJointGetUniversalAngle1Rate','number',['number']);
    var dJointGetUniversalAngle2Rate = Module.cwrap('dJointGetUniversalAngle2Rate','number',['number']);
    var dJointSetHinge2Anchor = Module.cwrap('dJointSetHinge2Anchor',null,['number','number','number','number']);
    var dJointGetHinge2Anchor = Module.cwrap('dJointGetHinge2Anchor',null,['number','number']);
    var dJointSetHinge2Axis1 = Module.cwrap('dJointSetHinge2Axis1',null,['number','number','number','number']);
    var dJointSetHinge2Axis2 = Module.cwrap('dJointSetHinge2Axis2',null,['number','number','number','number']);
    var dJointGetHinge2Axis1 = Module.cwrap('dJointGetHinge2Axis1',null,['number','number']);
    var dJointGetHinge2Axis2 = Module.cwrap('dJointGetHinge2Axis2',null,['number','number']);
    var dJointSetHinge2Param = Module.cwrap('dJointSetHinge2Param',null,['number','number','number']);
    var dJointGetHinge2Param = Module.cwrap('dJointGetHinge2Param','number',['number', 'number']);
    var dJointGetHinge2Angle1 = Module.cwrap('dJointGetHinge2Angle1','number',['number']);
    var dJointGetHinge2Angle1Rate = Module.cwrap('dJointGetHinge2Angle1Rate','number',['number']);
    var dJointGetHinge2Angle2Rate = Module.cwrap('dJointGetHinge2Angle2Rate','number',['number']);
    var dJointSetAMotorParam = Module.cwrap('dJointSetAMotorParam',null,['number','number','number']);
    var dJointGetAMotorParam = Module.cwrap('dJointGetAMotorParam','number',['number', 'number']);
    var dJointSetAMotorMode = Module.cwrap('dJointSetAMotorMode',null,['number','number']);
    var dJointGetAMotorMode = Module.cwrap('dJointGetAMotorMode','number',['number']);
    var dJointSetAMotorNumAxes = Module.cwrap('dJointSetAMotorNumAxes',null,['number','number']);
    var dJointGetAMotorNumAxes = Module.cwrap('dJointGetAMotorNumAxes','number',['number']);
    var dJointSetAMotorAxis = Module.cwrap('dJointSetAMotorAxis',null,['number','number','number','number','number','number']);
    var dJointGetAMotorAxis = Module.cwrap('dJointGetAMotorAxis',null,['number','number','number']);
    var dJointGetAMotorAxisRel = Module.cwrap('dJointGetAMotorAxisRel','number',['number', 'number']);
    var dJointSetAMotorAngle = Module.cwrap('dJointSetAMotorAngle',null,['number','number','number']);
    var dJointGetAMotorAngle = Module.cwrap('dJointGetAMotorAngle','number',['number', 'number']);
    var dJointGetAMotorAngleRate = Module.cwrap('dJointGetAMotorAngleRate','number',['number', 'number']);
    var dJointSetFixed = Module.cwrap('dJointSetFixed',null,['number']);

    /**
     * all abstract prototypes for Joint
     * @namespace ODE.Joint.Prototypes
     */
    /**
     * @name ODE.Joint.Prototypes.BaseJoint
     * @classdesc base prototype for a Joint
     * @abstract 
     * @class
     * @param {Number} pointer - heap memory pointer to cast into **ODE.Joint.Prototypes.BaseJoint**
     */
    /**
     * @name ODE.Joint.Prototypes.AnchorJoint
     * @classdesc base prototype for a anchpor Joint
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.BaseJoint
     */
    /**
     * @name ODE.Joint.Prototypes.AxisJoint
     * @classdesc base prototype for an Joint that contain one axis
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.BaseJoint
     */

    /**
     * @name ODE.Joint.BallJoint
     * @classdesc A ball and socket joint between 2 rigid bodies :  ![Ball and Socket](http://ode.org/pix/ball-and-socket.jpg)
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.AnchorJoint
     */
    /**
     * @name ODE.Joint.HingeJoint
     * @classdesc A hinge joint between 2 rigid bodies ![Hinge](http://ode.org/pix/hinge.jpg)
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.AnchorJoint
     * @extends ODE.Joint.Prototypes.AxisJoint
     */

    /**
     * @name ODE.Joint.Prototypes.ParametersJoint
     * @classdesc base prototype for an Joint that contain parameters
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.BaseJoint
     */



    function Joint(pointer)
    {
        var type = dJointGetType(pointer);
        /**
         * get offset address in heap memory
         * @method ODE.Joint.Prototypes.BaseJoint#getPointer
         * @returns {Number}
         */
        this.getPointer = function() { return pointer; }

        /**
         * clear memory space in LLVM heap
         * @method ODE.Joint.Prototypes.BaseJoint#destroy
         */
        this.destroy = function() { dJointDestroy(pointer);}
        /**
         * get the type of this joint
         * @name ODE.Joint.Prototypes.BaseJoint#type
         * @type {ODE.Joint.Types}
         * @readonly
         */
        Object.defineProperty(this,"type",{
            value : type,
            writable : false,
            enumerable : true,
            configurable : false
        });
        /**
         * Attach the joint to some new bodies. If the joint is already attached, it will be detached from the old bodies first. To attach this joint to only one body, set body1 or body2 to zero - a zero body refers to the static environment. Setting both bodies to zero puts the joint into "limbo", i.e. it will have no effect on the simulation.
         * Some joints, like hinge-2 need to be attached to two bodies to work.
         * @name ODE.Joint.Prototypes.BaseJoint#attach
         * @param {ODE.Body} b1 the first body
         * @param {ODE.Body} b2 the second body
         * @returns {ODE.Joint}
         */
        this.attach = function(b1,b2) { dJointAttach(pointer,(b1)? b1.getPointer() : 0,(b2)? b2.getPointer() : 0 ); return this; }

        /**
         * Return the bodies that this joint connects.
         * If **idx** is 0 the first body will be returned, corresponding to the first body argument of {@link ODE.Joint.Prototypes.BaseJoint#attach}.
         * If **idx** is 1 the second body will be returned, corresponding to the second body argument of {@link ODE.Joint.Prototypes.BaseJoint#attach}..
         * If one of these returned body IDs is zero, the joint connects the other body to the static environment. If both body IDs are zero, the joint is in ``limbo'' and has no effect on the simulation.
         * @name ODE.Joint.Prototypes.BaseJoint#getBody
         * @param {Number}idx
         * @returns {ODE.Body|null}
         */
        this.getBody = function(idx)
        {
            var b = dJointGetBody(pointer,idx);
            return (b)? new Body(b): null;
        }
        this.setFixed = function() { dJointSetFixed(pointer); return this; }
        switch(type)
        {
            case ODE.Joint.Types.Ball :
                /**
                 * Set anchor position
                 * @method ODE.Joint.Prototypes.AnchorJoint#setAnchor
                 * @param {Number} x
                 * @param {Number} y
                 * @param {Number} z
                 * @returns {ODE.Joint}
                 */
                this.setAnchor = function( x, y, z) { dJointSetBallAnchor(pointer, x, y, z); return this; }
                /**
                 * Get anchor position as array [x, y, z ]
                 * @method ODE.Joint.Prototypes.AnchorJoint#getAnchor
                 * @returns {Array<Number>}
                 */
                this.getAnchor = function() {
                    dJointGetBallAnchor(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                break;

            case ODE.Joint.Types.Hinge :
                this.setAnchor = function( x, y, z) { dJointSetHingeAnchor(pointer, x, y, z); return this; }
                this.getAnchor = function() {
                    dJointGetHingeAnchor(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                /**
                 * set axis orientation
                 * @method ODE.Joint.Prototypes.AxisJoint#setAxis
                 * @param {Number} x
                 * @param {Number} y
                 * @param {Number} z
                 * @returns {ODE.Joint}
                 */
                this.setAxis = function( x, y, z) { dJointSetHingeAxis(pointer, x, y, z); return this; }
                /**
                 * Get axis orientation as vector3
                 * @method ODE.Joint.Prototypes.AxisJoint#getAxis
                 * @returns {Array<Number>}
                 */
                this.getAxis = function() {
                    dJointGetHingeAxis(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }

                /**
                 * set limit/motor parameter
                 * @method ODE.Joint.Prototypes.ParametersJoint#setParam
                 * @param {ODE.Joint.Parameters} parameter
                 * @param {Number} val
                 * @returns {ODE.Joint}
                 */
                this.setParam = function( parameter, val) { dJointSetHingeParam (pointer, parameter, val); return this; }
                /**
                 * get limit/motor parameter
                 * @method ODE.Joint.Prototypes.ParametersJoint#getParam
                 * @param parameter
                 * @returns {Number}
                 */
                this.getParam = function(parameter) { return dJointGetHingeParam(pointer, parameter); }

                this.getAngle = function() { return dJointGetHingeAngle(pointer); }
                this.getAngleRate = function() { return dJointGetHingeAngleRate(pointer); }
                break;

            case ODE.Joint.Types.Slider :
                this.setAxis = function( x, y, z) { dJointSetSliderAxis(pointer, x, y, z); return this; }
                this.getAxis = function() {
                    dJointGetSliderAxis(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setParam = function( parameter, val) { dJointSetSliderParam (pointer, parameter, val); return this; }
                this.getParam = function(parameter) { return dJointGetSliderParam(pointer, parameter); }
                this.getPosition  = function() { return dJointGetSliderPosition(pointer); }
                this.getPositionRate = function() { return dJointGetSliderPositionRate(pointer); }
                break;

            case ODE.Joint.Types.Universal :
                this.setAnchor = function( x, y, z) { dJointSetUniversalAnchor(pointer, x, y, z); return this; }
                this.getAnchor = function() {
                    dJointGetUniversalAnchor(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.getAnchor2 = function() {
                    dJointGetUniversalAnchor2 (pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setAxis1 = function( x, y, z) { dJointSetUniversalAxis1(pointer, x, y, z); return this; }
                this.getAxis1 = function() {
                    dJointGetUniversalAxis1(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setAxis2 = function( x, y, z) { dJointSetUniversalAxis2(pointer, x, y, z); return this; }
                this.getAxis2 = function() {
                    dJointGetUniversalAxis2(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setParam = function( parameter, val) { dJointSetUniversalParam(pointer, parameter, val); return this; }
                this.getParam = function(parameter) { return dJointGetUniversalParam(pointer, parameter); }
                this.getAngle1 = function() { return dJointGetUniversalAngle1(pointer); }
                this.getAngle2 = function() { return dJointGetUniversalAngle2(pointer); }
                this.getAngleRate1 = function() { return dJointGetUniversalAngleRate1(pointer); }
                this.getAngleRate2 = function() { return dJointGetUniversalAngleRate2(pointer); }
                break;

            case ODE.Joint.Types.Hinge2 :
                this.setAnchor = function( x, y, z) { dJointSetHinge2Anchor(pointer, x, y, z); return this; }
                this.getAnchor = function() {
                    dJointGetHinge2Anchor(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setAxis1 = function( x, y, z) { dJointSetHinge2Axis1(pointer, x, y, z); return this; }
                this.getAxis1 = function() {
                    dJointGetHinge2Axis1(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setAxis2 = function( x, y, z) { dJointSetHinge2Axis2(pointer, x, y, z); return this; }
                this.getAxis2 = function() {
                    dJointGetHinge2Axis2(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.setParam = function( parameter, val) { dJointSetHinge2Param(pointer, parameter, val); return this; }
                this.getParam = function(parameter) { return dJointGetHinge2Param(pointer, parameter); }
                this.getAngle1 = function() { return dJointGetHinge2Angle1(pointer); }
                this.getAngle1Rate = function() { return dJointGetHinge2Angle1Rate(pointer); }
                this.getAngle2Rate = function() { return dJointGetHinge2Angle2Rate(pointer); }
                break;

            case ODE.Joint.Types.AMotor :
                this.setParam = function( parameter, val) { dJointSetAMotorParam(pointer, parameter, val); return this; }
                this.getParam = function(parameter) { return dJointGetAMotorParam(pointer, parameter); }
                this.setAMotorMode = function(mode) { dJointSetAMotorMode(pointer, mode); return this; }
                this.getAMotorMode = function() { return dJointGetAMotorMode(pointer); }
                this.setNumAxes = function(num) { dJointSetAMotorNumAxes(pointer, num); return this; }
                this.getNumAxes  = function() { return dJointGetAMotorNumAxes(pointer); }
                this.setAxis = function(anum, rel, x, y, z) { dJointSetAMotorAxis(pointer, anum, rel, x, y, z); return this; }
                this.getAxis = function( anum) {
                    dJointGetAMotorAxis(pointer, anum,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                this.getAxisRel = function( anum) { return dJointGetAMotorAxisRel(pointer, anum); }
                this.setAngle = function(anum, angle) { dJointSetAMotorAngle(anum, angle); return this; }
                this.getAngle = function( anum) { return dJointGetAMotorAngle(pointer, anum); }
                this.getAngleRate = function( anum) { return dJointGetAMotorAngleRate(pointer, anum); }
                break;

            default:
                break;
        }
    }
    /**************                                   Contact Object                                   *********************/
    var sizeOfCantact= 104;

    ODE.Contact = (function()
    {
        var contact = function(/*pointer*/)
        {
            var pointer = arguments[0] ||  Module._malloc(sizeOfCantact);
            this.getPointer = function() { return pointer;}
            this.surface = {};
            Object.defineProperties(this.surface, {
                mode : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer,'i32') },
                    set : function(val) {  	 Module.setValue(pointer,val,'i32')	}
                },
                mu : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+4,'float') },
                    set : function(val) {  	 Module.setValue(pointer+4,val,'float')	}
                },
                mu2 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+8,'float') },
                    set : function(val) {  	 Module.setValue(pointer+8,val,'float')	}
                },
                bounce : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+12,'float') },
                    set : function(val) {  	 Module.setValue(pointer+12,val,'float')	}
                },
                bounce_vel : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+16,'float') },
                    set : function(val) {  	 Module.setValue(pointer+16,val,'float')	}
                },
                soft_erp : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+20,'float') },
                    set : function(val) {  	 Module.setValue(pointer+20,val,'float')	}
                },
                soft_cfm : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+24,'float') },
                    set : function(val) {  	 Module.setValue(pointer+24,val,'float')	}
                },
                motion1 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+28,'float') },
                    set : function(val) {  	 Module.setValue(pointer+24,val,'float')	}
                },
                motion2 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+32,'float') },
                    set : function(val) {  	 Module.setValue(pointer+32,val,'float')	}
                },
                slip1 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+36,'float') },
                    set : function(val) {  	 Module.setValue(pointer+36,val,'float')	}
                },
                slip2 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+40,'float') },
                    set : function(val) {  	 Module.setValue(pointer+40,val,'float')	}
                }
            });
            this.geom={};
            Object.defineProperties(this.geom, {
                pos : {
                    enumerable : true,
                    get : function(){ return [ Module.getValue(pointer+44,'float'), Module.getValue(vec4+48,'float'), Module.getValue(vec4+52,'float') ];},
                    set : function(val) { Module.setValue(pointer+44,val[0],'float'), Module.setValue(pointer+48,val[1],'float'),Module.setValue(pointer+52,val[2],'float')	}
                },
                normal: {
                    enumerable : true,
                    get : function(){ return [ Module.getValue(pointer+60,'float'), Module.getValue(vec4+64,'float'), Module.getValue(vec4+68,'float') ];},
                    set : function(val) { Module.setValue(pointer+60,val[0],'float'), Module.setValue(pointer+64,val[1],'float'),Module.setValue(pointer+68,val[2],'float')	}
                },
                depth: {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+76,'float') },
                    set : function(val) {  	 Module.setValue(pointer+76,val,'float')	}
                },
                g1 : {
                    enumerable : true,
                    get : function()
                    {
                        var p = Module.getValue(pointer+80,'i32');
                        return (p)? new Geom(p) : null;
                    },
                    set : function(val) {  	 Module.setValue(pointer+80,val.getPointer(),'i32')	}
                },
                g2  : {
                    enumerable : true,
                    get : function()
                    {
                        var p =  Module.getValue(pointer+84,'i32');
                        return (p)? new Geom(p) : null;
                    },
                    set : function(val) {  	 Module.setValue(pointer+84,val.getPointer(),'i32')	}
                }
            });
            Object.defineProperty(this,"fdir1",{
                enumerable : true,
                get : function(){ return [ Module.getValue(pointer+88,'float'), Module.getValue(vec4+92,'float'), Module.getValue(vec4+96,'float') ];},
                set : function(val) { Module.setValue(pointer+88,val[0],'float'), Module.setValue(pointer+92,val[1],'float'),Module.setValue(pointer+96,val[2],'float')	}
            });
        }
        contact.Mode = {
            Mu2		: 0x001,
            FDir1	: 0x002,
            Bounce	: 0x004,
            SoftERP	: 0x008,
            SoftCFM	: 0x010,
            Motion1	: 0x020,
            Motion2	: 0x040,
            Slip1	: 0x080,
            Slip2	: 0x100,

            Approx0	: 0x0000,
            Approx1_1	: 0x1000,
            Approx1_2	: 0x2000,
            Approx1	: 0x3000
        };
        return contact;
    })()


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
    var dWorldSetQuickStepNumIterations =  Module.cwrap('dWorldSetQuickStepNumIterations',null,['number','number']);
    var dWorldQuickStep =  Module.cwrap('dWorldQuickStep',null,['number','number']);

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
        this.quickStep = function(stepsize) { dWorldQuickStep(pointer,stepsize); return this; }
        this.setQuickStepNumIterations = function(num) { dWorldSetQuickStepNumIterations(pointer,num); return this; }

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



    /**************                                   Geom API                                   *********************/
    var dCreateSphere = Module.cwrap('dCreateSphere','number',['number','number']);
    var dCreateBox = Module.cwrap('dCreateBox','number',['number','number','number','number']);
    var dCreatePlane = Module.cwrap('dCreatePlane','number',['number','number','number','number','number']);
    var dCreateCapsule = Module.cwrap('dCreateCapsule','number',['number','number','number']);
    var dCreateCylinder = Module.cwrap('dCreateCylinder','number',['number','number','number']);
    var dCreateGeomTransform =  Module.cwrap('dCreateGeomTransform','number',['number']);
    var dGeomGetClass = Module.cwrap('dGeomGetClass','number',['number']);
    var dGeomDestroy = Module.cwrap('dGeomDestroy',null,['number']);
    var dGeomSetPosition = Module.cwrap('dGeomSetPosition',null,['number','number','number','number']);
    var dGeomSetRotation = Module.cwrap('dGeomSetRotation',null,['number','number']);
    var dGeomGetPosition = Module.cwrap('dGeomGetPosition','number',['number']);
    var dGeomGetRotation = Module.cwrap('dGeomGetRotation','number',['number']);
    var dGeomSetBody = Module.cwrap('dGeomSetBody',null,['number','number']);
    var dGeomGetBody = Module.cwrap('dGeomGetBody','number',['number']);
    var dGeomGetAABB = Module.cwrap('dGeomGetAABB',null,['number','number']);
    var dGeomGetSpaceAABB = Module.cwrap('dGeomGetRotation','number',['number']);
    var dGeomSphereSetRadius = Module.cwrap('dGeomSphereSetRadius',null,['number','number']);
    var dGeomBoxSetLengths = Module.cwrap('dGeomBoxSetLengths',null,['number','number','number','number']);
    var dGeomPlaneSetParams = Module.cwrap('dGeomPlaneSetParams',null,['number','number','number','number','number']);
    var dGeomCapsuleSetParams = Module.cwrap('dGeomCapsuleSetParams',null,['number','number','number']);
    var dGeomSphereGetRadius = Module.cwrap('dGeomSphereGetRadius','number',['number']);
    var dGeomBoxGetLengths = Module.cwrap('dGeomBoxGetLengths',null,['number','number']);
    var dGeomPlaneGetParams = Module.cwrap('dGeomPlaneGetParams',null,['number','number']);
    var dGeomCapsuleGetParams = Module.cwrap('dGeomCapsuleGetParams',null,['number','number', 'number']);
    var dGeomTransformSetGeom = Module.cwrap('dGeomTransformSetGeom',null,['number','number']);
    var dGeomTransformGetGeom = Module.cwrap('dGeomTransformGetGeom','number',['number']);
    var dGeomTransformSetCleanup = Module.cwrap('dGeomTransformSetCleanup',null,['number','number']);
    var dGeomTransformGetCleanup = Module.cwrap('dGeomTransformGetCleanup','number',['number']);
    var dCollide = Module.cwrap('dCollide','number',['number','number', 'number', 'number', 'number']);

    ODE.Geom = {
        Types : {
            Sphere 		:1,
            Box			:2,
            Capsule 	:3,
            Cylinder	:4,
            Plane		:5,
            Ray			:6,
            Convex		:7,
            Transform	:8,
            TriMesh		:9,
            Heightfield	:10
        },

        collide : function(g1, g2, MaxContact, contactCB)
        {
            var contacts = Module._malloc(MaxContact * sizeOfCantact);
            var n = dCollide((g1)? g1.getPointer() : 0 , (g2)? g2.getPointer() : 0 , MaxContact, contacts+44, sizeOfCantact);
            for(var i=0;i<n;i++)
            {
                contactCB(new ODE.Contact(contacts+i*sizeOfCantact));
            }
            Module._free(contacts);
        }
    }

    function Geom(pointer)
    {
        var type = dGeomGetClass(pointer);
        this.getPointer = function() { return pointer; }
        this.destroy = function() { dGeomDestroy(pointer);}
        Object.defineProperty(this,"type",{
            value : type,
            writable : false,
            enumerable : true,
            configurable : false
        });
        this.setPosition = function(x,y,z) { dGeomSetPosition(pointer,x,y,z); return this; }
        this.setRotation = function(rotation) { dGeomSetRotation(pointer, rotation.getPointer()); return this;}

        this.getPosition = function()
        {
            var p = dGeomGetPosition(pointer);
            return Module.HEAPF32.slice(p/4,p/4+3);
        }

        this.getRotation = function()
        {
            return new ODE.Rotation(dGeomGetRotation(pointer));
        }
        this.setBody = function(body) { dGeomSetBody(pointer, body.getPointer()); return this;}
        this.getBody  = function()
        {
            var b = dGeomGetBody(pointer);
            return (b)? new Body(b) : null;
        }
        this.getAABB = function()
        {
            dGeomGetAABB(pointer,vec6);
            return getVec6();
        }
        this.getSpaceAABB = function()
        {
            var p = dGeomGetSpaceAABB(pointer);
            return Module.HEAPF32.slice(p/4,p/4+6);
        }
        switch(type)
        {
            case ODE.Geom.Types.Sphere :
                Object.defineProperty(this,"radius" ,{
                    enumerable : true,
                    get : function(){ return dGeomSphereSetRadius(pointer) },
                    set : function(val) {  	dGeomSphereGetRadius(pointer,val);}
                });
                break;

            case ODE.Geom.Types.Box :
                this.setLengths = function(x,y,z) {dGeomBoxSetLengths(pointer,x,y,z); return this; }
                this.getLengths = function() {
                    dGeomBoxGetLengths(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
                }
                break;

            case ODE.Geom.Types.Capsule :
                this.setParams = function(radius, length) {dGeomCapsuleSetParams(pointer,radius, length); return this; }
                this.getParams = function()
                {
                    dGeomCapsuleGetParams(pointer,vec4,vec4+4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float')];
                }
                break;

            case ODE.Geom.Types.Plan :
                this.setParams = function(a, b, c, d) {dGeomPlaneSetParams(pointer,a, b, c, d); return this; }
                this.getParams = function()
                {
                    dGeomPlaneGetParams(pointer,vec4);
                    return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float'), Module.getValue(vec4+12,'float') ];
                }
                break;


            case ODE.Geom.Types.Transform :
                this.setGeom = function(geom) { dGeomTransformSetGeom(pointer, geom.getPointer()); return this; }
                this.getGeom = function()
                {
                    var g = dGeomTransformGetGeom(pointer);
                    return (g)? new Geom(g) : null;
                }
                Object.defineProperty(this,"cleanup" ,{
                    enumerable : true,
                    get : function(){ return dGeomTransformGetCleanup(pointer) },
                    set : function(val) {  	dGeomTransformSetCleanup(pointer,val);}
                });
                break;

            default:
                break;
        }
    }

    ODE.Geom.createSphere = function(radius)
    {
        var g= dCreateSphere(0,radius)
        return new Geom(g);
    }

    ODE.Geom.createBox = function(lx,ly,lz)
    {
        var g = dCreateBox(0,lx,ly,lz);
        return new Geom(g);
    }

    ODE.Geom.createCapsule = function(radius, length)
    {
        var g = dCreateCapsule(0, radius, length);
        return new Geom(g);
    }

    ODE.Geom.createCylinder = function(radius, length)
    {
        var g = dCreateCylinder(0, radius, length);
        return new Geom(g);
    }


    ODE.Geom.createPlane = function(a, b, c, d)
    {
        var g = dCreatePlane(0, a, b, c, d);
        return new Geom(g);
    }


    ODE.Geom.createTransform = function()
    {
        var g = dCreateGeomTransform(0);
        return new Geom(g);
    }


    /**************                                   TriMeshData API                                   *********************/
    var dGeomTriMeshDataCreate = Module.cwrap('dGeomTriMeshDataCreate','number',[]);
    var dGeomTriMeshDataDestroy = Module.cwrap('dGeomTriMeshDataDestroy',null,['number']);
    var dGeomTriMeshDataBuildSingle = Module.cwrap('dGeomTriMeshDataBuildSingle',null,['number', 'number', 'number', 'number', 'number', 'number', 'number']);
    var dGeomTriMeshDataBuildSingle1 = Module.cwrap('dGeomTriMeshDataBuildSingle1',null,['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    var dCreateTriMesh = Module.cwrap('dCreateTriMesh',null,['number', 'number', 'number', 'number', 'number']);

    ODE.Geom.createTriMeshData = function(Vertices,Indices,Normals)
    {
        var pointer = dGeomTriMeshDataCreate();
        var vbo = Module._malloc(Vertices.length*4);
        for(var i=0;i<Vertices.length;i++)
            Module.setValue(vbo+i*4, Vertices[i], 'float');
        var ibo = Module._malloc(Indices.length*4);
        for(var i=0;i<Indices.length;i++)
            Module.setValue(ibo+i*4, Indices[i], 'i32');
        var nbo;
        if(arguments.length==2) {
            dGeomTriMeshDataBuildSingle(pointer, vbo, 12, Vertices.length / 3, ibo, Indices.length, 12);
        }
        else {
            nbo = Module._malloc(Normals.length*4);
            for(var i=0;i<Normals.length;i++)
                Module.setValue(vbo+i*4, Normals[i], 'float');

            dGeomTriMeshDataBuildSingle1(pointer, vbo, 12, Vertices.length / 3, ibo, Indices.length, 12, nbo);
        }
        return {
            getPointer : function() { return pointer;},
            destroy : function() {
                dGeomTriMeshDataDestroy(pointer);
                Module._free(vbo);
                Module._free(ibo);
                if(nbo)
                    Module._free(nbo);
            }
        };
    }

    ODE.Geom.createTriMesh = function(triMeshData)
    {
        var g = dCreateTriMesh(0, triMeshData.getPointer(), 0, 0, 0);
        return new Geom(g);
    }


    /**************                                   Heightfield API                                   *********************/
    var dGeomHeightfieldDataCreate = Module.cwrap('dGeomHeightfieldDataCreate','number',[]);
    var dGeomHeightfieldDataDestroy = Module.cwrap('dGeomHeightfieldDataDestroy',null,['number']);
    var dGeomHeightfieldDataBuildCallback = Module.cwrap('dGeomHeightfieldDataBuildCallback',null,['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    var dGeomHeightfieldDataSetBounds = Module.cwrap('dGeomHeightfieldDataSetBounds',null,['number', 'number', 'number']);
    var dCreateHeightfield = Module.cwrap('dCreateHeightfield',null,['number', 'number', 'number']);

    ODE.Geom.createHeightfieldData = function( callback, width, depth, widthSamples, depthSamples, scale, offset, thickness, bWrap)
    {
        var pointer = dGeomHeightfieldDataCreate();
        var ptrFunc = Runtime.addFunction(function(data,x,y)
        {
            return callback(x,y);
        });
        dGeomHeightfieldDataBuildCallback(pointer,0,ptrFunc, width, depth, widthSamples, depthSamples, scale, offset, thickness, bWrap);

        return {
            getPointer : function() { return pointer;},
            setBounds  : function(minHeight, maxHeight ) {
                dGeomHeightfieldDataSetBounds(pointer, minHeight, maxHeight);
            },
            destroy : function() {
                dGeomHeightfieldDataDestroy(pointer);
                Runtime.removeFunction(ptrFunc);
            }
        };
    }

    ODE.Geom.createHeightfield = function(data,bPlaceable)
    {
        var g = dCreateHeightfield(0, data.getPointer(), bPlaceable);
        return new Geom(g);
    }



    /**************                                   Space API                                   *********************/
    var dSimpleSpaceCreate = Module.cwrap('dSimpleSpaceCreate','number',[]);
    var dHashSpaceCreate =  Module.cwrap('dHashSpaceCreate','number',[]);
    var dSpaceDestroy = Module.cwrap('dSpaceDestroy',null,['number']);
    var dSpaceAdd = Module.cwrap('dSpaceAdd',null,['number','number']);
    var dSpaceRemove = Module.cwrap('dSpaceRemove',null,['number','number']);
    var dHashSpaceSetLevels =  Module.cwrap('dHashSpaceSetLevels',null,['number','number','number']);
    var dHashSpaceGetLevels =  Module.cwrap('dHashSpaceGetLevels',null,['number','number','number']);
    var dSpaceCollide = Module.cwrap('dSpaceCollide',null,['number','number','number']);
    var dSpaceSetCleanup = Module.cwrap('dSpaceSetCleanup',null,['number','number']);
    var dSpaceGetCleanup =  Module.cwrap('dSpaceGetCleanup','number',['number']);

    function Space(pointer)
    {
        this.getPointer = function() { return pointer;}
        this.destroy = function() { dSpaceDestroy(pointer); }
        this.add = function(geom) { dSpaceAdd(pointer, geom.getPointer()); return this; }
        this.remove = function(geom) { dSpaceRemove(pointer, geom.getPointer()); return this; }

        Object.defineProperty(this,"autoCleanup",{
            enumerable : true,
            get : function(){ return dSpaceGetCleanup(pointer)==1 },
            set : function(val) { dSpaceSetCleanup(pointer,val? 1: 0);	}
        });

        this.collide = function( nearCallback)
        {
            var ptrFunc = Runtime.addFunction(function(data,g1,g2)
            {
                var geom1 = (g1)? new Geom(g1) : null;
                var geom2 = (g2)? new Geom(g2) : null;
                if(geom1 && geom2)
                    nearCallback(geom1, geom2)
            });
            dSpaceCollide(pointer,0,ptrFunc);
            Runtime.removeFunction(ptrFunc);
        }
        this.createSphere = function(radius)
        {
            var g= dCreateSphere(pointer,radius)
            return new Geom(g);
        }

        this.createBox = function(lx,ly,lz)
        {
            var g = dCreateBox(pointer,lx,ly,lz);
            return new Geom(g);
        }

        this.createCapsule = function(radius, length)
        {
            var g = dCreateCapsule(pointer, radius, length);
            return new Geom(g);
        }

        this.createCylinder = function(radius, length)
        {
            var g = dCreateCylinder(pointer, radius, length);
            return new Geom(g);
        }

        this.createPlane = function(a, b, c, d)
        {
            var g = dCreatePlane(pointer, a, b, c, d);
            return new Geom(g);
        }

        this.createTriMesh = function(triMeshData)
        {
            var g = dCreateTriMesh(pointer, triMeshData.getPointer(), 0, 0, 0);
            return new Geom(g);
        }

        this.createHeightfield = function(data,bPlaceable)
        {
            var g = dCreateHeightfield(pointer, data.getPointer(), bPlaceable);
            return new Geom(g);
        }

        this.createTransform = function()
        {
            var g = dCreateGeomTransform(pointer);
            return new Geom(g);
        }

        this.createSimpleGroup = function()
        {
            var gp = dSimpleSpaceCreate(pointer);
            dSpaceSetCleanup(gp,0);
            return new Space(gp);
        }
    }

    ODE.Space = {
        Simple : function() { Space.call(this,dSimpleSpaceCreate()); },
        Hash : function()
        {
            Space.call(this,dSimpleSpaceCreate());
            this.setHashLevels = function(minlevel, maxlevel) { dHashSpaceSetLevels(this.getPointer(), minlevel, maxlevel); return this; };
            this.getHashLevels = function() {
                dHashSpaceGetLevels(this.getPointer(), vec4 , vec4+4);
                return [ Module.getValue(vec4,'i32'), Module.getValue(vec4+4,'i32') ];
            }
        }
    };


	if (ENVIRONMENT_IS_NODE)
		module.exports = ODE;
	
	return ODE;

})()