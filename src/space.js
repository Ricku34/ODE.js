
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

