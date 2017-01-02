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