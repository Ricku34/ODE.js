    
    var _resolve;
    var ODE = {
        /**
         * porperty indicate if API is ready
         * @name ODE#ready
         * @type {boolean}
         * @readonly
         */
        ready : false,

        /**
         * Promise resolve when API is ready
         * @name ODE#readyPromise
         * @type {Promise}
         * @readonly
         */
        readyPromise : new Promise(function(resolve) { _resolve = resolve})
    };

    addOnPostRun(function() {
    
        var javascriptHeap = {};

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
