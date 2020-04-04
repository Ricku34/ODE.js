


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
        if(!javascriptHeap[pointer]) {
            javascriptHeap[pointer] = this;
        }
        
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
            var p = dGeomGetRotation(pointer);
            return (p)? ((!javascriptHeap[p])? new ODE.Rotation(p): javascriptHeap[p] ): null;
        }
        this.setBody = function(body) { dGeomSetBody(pointer, body.getPointer()); return this;}
        this.getBody  = function()
        {
            var b = dGeomGetBody(pointer);
            return (b)? ((!javascriptHeap[b])? new Body(b): javascriptHeap[b] ): null;
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
                    return (g)? ((!javascriptHeap[g])? new Geom(g): javascriptHeap[g] ): null;
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
        var ptrFunc = Module.addFunction(function(data,x,y)
        {
            return callback(x,y);
        },'fiii');
        dGeomHeightfieldDataBuildCallback(pointer,0,ptrFunc, width, depth, widthSamples, depthSamples, scale, offset, thickness, bWrap);

        return {
            getPointer : function() { return pointer;},
            setBounds  : function(minHeight, maxHeight ) {
                dGeomHeightfieldDataSetBounds(pointer, minHeight, maxHeight);
            },
            destroy : function() {
                dGeomHeightfieldDataDestroy(pointer);
                Module.removeFunction(ptrFunc);
            }
        };
    }

    ODE.Geom.createHeightfield = function(data,bPlaceable)
    {
        var g = dCreateHeightfield(0, data.getPointer(), bPlaceable);
        return new Geom(g);
    }

