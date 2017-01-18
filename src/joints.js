

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
     * @name ODE.Joint.Prototypes.ParametersJoint
     * @classdesc base prototype for an Joint that contain parameters
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.BaseJoint
     */
    /**
     * @name ODE.Joint.Prototypes.AngleJoint
     * @classdesc base prototype for an Joint that contain an angle
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
     * @extends ODE.Joint.Prototypes.ParametersJoint
     * @extends ODE.Joint.Prototypes.AngleJoint
     */
    /**
     * @name ODE.Joint.SliderJoint
     * @classdesc A Slider joint between 2 rigid bodies![Slider](http://ode.org/pix/slider.jpg)
     * @abstract
     * @class
     * @extends ODE.Joint.Prototypes.AxisJoint
     * @extends ODE.Joint.Prototypes.ParametersJoint
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
         * @method  ODE.Joint.Prototypes.BaseJoint#attach
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
         * @method  ODE.Joint.Prototypes.BaseJoint#getBody
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
                 * @param {ODE.Joint.Parameters} parameter
                 * @returns {Number}
                 */
                this.getParam = function(parameter) { return dJointGetHingeParam(pointer, parameter); }

                /**
                 * get angle, measured between the two bodies, or between the body and the static environment. The angle will be between -pi..pi.
                 * @method ODE.Joint.Prototypes.AngleJoint#getAngle
                 * @returns {Number}
                 */
                this.getAngle = function() { return dJointGetHingeAngle(pointer); }
                /**
                 * get the time derivative of the angle
                 * @method ODE.Joint.Prototypes.AngleJoint#getAngleRate
                 * @returns {Number}
                 */
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
                /**
                 * Get the slider linear position (i.e. the slider's ``extension''
                 * @method ODE.Joint.SliderJoint#getPosition
                 * @returns {Number}
                 */
                this.getPosition  = function() { return dJointGetSliderPosition(pointer); }
                /**
                 * Get the  time derivative of the slider linear position
                 * @method ODE.Joint.SliderJoint#ggetPositionRate
                 * @returns {Number}
                 */
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