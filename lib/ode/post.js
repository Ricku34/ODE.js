
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
	
	ODE.Rotation = function()
	{
		var pointor = arguments[0] ||  Module._malloc(sizeOfRotation);
		this.getPointor = function() { return pointor;};
		this.setIdentity = function() { dRSetIdentity(pointor); return this; };
		this.setArray = function (mat)
		{
			for(var i=0;i<12;i++)
				Module.setValue(pointor+i*4, mat[i], 'float');
			return this;
		}
		this.getArray = function(geom)
		{
			return Module.HEAPF32.slice(pointor/4,pointor/4+12);
		}
		this.fromAxisAndAngle = function ( ax, ay, az, angle) { dRFromAxisAndAngle(pointor, ax, ay, az, angle); return this; }
		this.fromEulerAngles  = function ( phi, theta, psi)  { dRFromEulerAngles(pointor, phi, theta, psi); return this; }
	}
	
	/**************                                   Quaternion API                                   *********************/
	var sizeOfQuaternion = 4*4;
	var dQSetIdentity = Module.cwrap('dQSetIdentity',null,['number']);
	var dQFromAxisAndAngle = Module.cwrap('dQFromAxisAndAngle',null,['number', 'number', 'number', 'number', 'number']);
	ODE.Quaternion = function()
	{
		var pointor = arguments[0] ||  Module._malloc(sizeOfQuaternion);
		this.getPointor = function() { return pointor;};
		this.setIdentity = function() { dQSetIdentity(pointor); return this; };
		this.setArray = function (quat)
		{
			for(var i=0;i<4;i++)
				Module.setValue(pointor+i*4, quat[i], 'float');
			return this;
		}
		this.getArray = function(geom)
		{
			return Module.HEAPF32.slice(pointor/4,pointor/4+4);
		}
		this.fromAxisAndAngle = function ( ax, ay, az, angle) { dQFromAxisAndAngle(pointor, ax, ay, az, angle); return this; }
	}
	
	/**************                                   Mass API                                   *********************/
	var sizeOfMass = (1+4+4*3)*4;
	var dMassSetZero = Module.cwrap('dMassSetZero',null,['number']);
	var dMassSetParameters = Module.cwrap('dMassSetParameters',null,['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
	var dMassSetSphere = Module.cwrap('dMassSetSphere',null,['number', 'number', 'number']);
	var dMassSetCappedCylinder = Module.cwrap('dMassSetCappedCylinder',null,['number', 'number', 'number', 'number', 'number']);
	var dMassSetBox = Module.cwrap('dMassSetBox',null,['number', 'number', 'number', 'number', 'number']);
	var dMassAdjust = Module.cwrap('dMassAdjust',null,['number', 'number']);
	var dMassTranslate = Module.cwrap('dMassTranslate',null,['number', 'number', 'number', 'number']);
	var dMassRotate = Module.cwrap('dMassRotate',null,['number', 'number']);
	var dMassAdd = Module.cwrap('dMassAdd',null,['number', 'number']);
	
	ODE.Mass = function ()
	{
		var pointor = arguments[0] ||  Module._malloc(sizeOfMass);
		this.getPointor = function() { return pointor;}
		this.destroy = function() { return Module._free(pointor); }
		this.setZero = function() { dMassSetZero(pointor); return this;}
		this.setParameters = function( mass,cgx, cgy, cgz, I11, I22, I33, I12, I13, I23) {  dMassSetParameters(pointor, mass,cgx, cgy, cgz, I11, I22, I33, I12, I13, I23); return this;}
		this.setSphere = function(density, radius) { dMassSetSphere(pointor,density, radius); return this;}
		this.setCappedCylinder = function(density, direction, a, b) { dMassSetCappedCylinder(pointor, density, direction, a, b); return this;}
		this.setBox = function(density, lx, ly, lz) { dMassSetBox(pointor, density, lx, ly, lz); return this;}
		this.adjust = function(newmass) { dMassAdjust(pointor, newmass); return this;}
		this.translate = function(x,y,z) {  dMassTranslate(pointor, x,y,z); return this;}
		this.rotate = function(rotation) { dMassRotate(mass, rotation.getPointor()); return this;}
		this.add = function(mass) { dMassAdd(pointor, mass.getPointor()); return this;}
	}
	
	/**************                                   Joint API                                   *********************/
	var dJointGroupCreate = Module.cwrap('dJointGroupCreate','number',['number'])
	var dJointGroupDestroy = Module.cwrap('dJointGroupDestroy',null,['number']);
	var dJointGroupEmpty = Module.cwrap('dJointGroupEmpty',null,['number']);
	ODE.Joint = {
		Types : {
			Unknown 	: 0,
			Ball 		: 1,
			Hinge 		: 2,
			Slider 		: 3,
			Contact		: 4,
			Hinge2 		: 5,
			Fixed 		: 6,
			Null 		: 7,
			AMotor 		: 8
		},
		
		Parameters : {
			LoStop				: 0,
			HiStop				: 1,
			Vel					: 2,
			FMax				: 3,
			FudgeFactor			: 4,
			Bounce				: 5,
			StopERP				: 6,
			StopCFM				: 7,
			SuspensionERP		: 8,
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
		
		Group : function(max_size)
		{
			var pointor = dJointGroupCreate(max_size);
			this.getPointor = function() { return pointor;}
			this.destroy = function() { dJointDestroy(pointor)}
			this.empty = function() { dJointGroupEmpty(pointor); return this}
		}
	};
	var dJointCreateBall = Module.cwrap('dJointCreateBall','number',['number', 'number']);
	var dJointCreateHinge = Module.cwrap('dJointCreateHinge','number',['number', 'number']);
	var dJointCreateSlider = Module.cwrap('dJointCreateSlider','number',['number', 'number']);
	var dJointCreateSlider = Module.cwrap('dJointCreateSlider','number',['number', 'number']);
	var dJointCreateSlider = Module.cwrap('dJointCreateSlider','number',['number', 'number']);
	var dJointCreateContact = Module.cwrap('dJointCreateContact','number',['number', 'number' , 'number']);
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
	
	function Joint(pointor)
	{
		var type = dJointGetType(pointor);
		this.getPointor = function() { return pointor; }
		this.destroy = function() { dJointDestroy(pointor);}
		Object.defineProperty(this,"type",{
			value : type,
			writable : false,
			enumerable : true,
			configurable : false
		});
		this.attach = function(b1,b2) { dJointAttach(pointor,(b1)? b1.getPointor() : 0,(b2)? b2.getPointor() : 0 ); return this; }
		this.getBody = function(idx) 
		{ 
			var b = dJointGetBody(pointor,idx); 
			return (b)? new Body(b): null;
		}
		this.setFixed = function() { dJointSetFixed(pointor); return this; }
		switch(type)
		{
			case ODE.Joint.Types.Ball :
				this.setAnchor = function( x, y, z) { dJointSetBallAnchor(pointor, x, y, z); return this; }
				this.getAnchor = function() {
					dJointGetBallAnchor(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				break;
			
			case ODE.Joint.Types.Hinge :
				this.setAnchor = function( x, y, z) { dJointSetHingeAnchor(pointor, x, y, z); return this; }
				this.getAnchor = function() {
					dJointGetHingeAnchor(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.setAxis = function( x, y, z) { dJointSetHingeAxis(pointor, x, y, z); return this; }
				this.getAxis = function() {
					dJointGetHingeAxis(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.setParam = function( parameter, val) { dJointSetHingeParam (pointor, parameter, val); return this; }
				this.getParam = function(parameter) { return dJointGetHingeParam(pointor, parameter); }
				this.getAngle = function() { return dJointGetHingeAngle(pointor); }
				this.getAngleRate = function() { return dJointGetHingeAngleRate(pointor); } 
				break;
			
			case ODE.Joint.Types.Slider :
				this.setAxis = function( x, y, z) { dJointSetSliderAxis(pointor, x, y, z); return this; }
				this.getAxis = function() {
					dJointGetSliderAxis(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.setParam = function( parameter, val) { dJointSetSliderParam (pointor, parameter, val); return this; }
				this.getParam = function(parameter) { return dJointGetSliderParam(pointor, parameter); }
				this.getPosition  = function() { return dJointGetSliderPosition(pointor); }
				this.getPositionRate = function() { return dJointGetSliderPositionRate(pointor); }
				break;
				
			case ODE.Joint.Types.Hinge2 :
				this.setAnchor = function( x, y, z) { dJointSetHinge2Anchor(pointor, x, y, z); return this; }
				this.getAnchor = function() {
					dJointGetHinge2Anchor(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.setAxis1 = function( x, y, z) { dJointSetHinge2Axis1(pointor, x, y, z); return this; }
				this.getAxis1 = function() {
					dJointGetHinge2Axis1(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.setAxis2 = function( x, y, z) { dJointSetHinge2Axis2(pointor, x, y, z); return this; }
				this.getAxis2 = function() {
					dJointGetHinge2Axis2(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.setParam = function( parameter, val) { dJointSetHinge2Param(pointor, parameter, val); return this; }
				this.getParam = function(parameter) { return dJointGetHinge2Param(pointor, parameter); }
				this.getAngle1 = function() { return dJointGetHinge2Angle1(pointor); }
				this.getAngle1Rate = function() { return dJointGetHinge2Angle1Rate(pointor); } 
				this.getAngle2Rate = function() { return dJointGetHinge2Angle2Rate(pointor); } 
				break;
				
			case ODE.Joint.Types.Hinge2 :
				this.setParam = function( parameter, val) { dJointSetAMotorParam(pointor, parameter, val); return this; }
				this.getParam = function(parameter) { return dJointGetAMotorParam(pointor, parameter); }
				this.setAMotorMode = function(mode) { dJointSetAMotorMode(pointor, mode); return this; }
				this.getAMotorMode = function() { return dJointGetAMotorMode(pointor); }
				this.setNumAxes = function(num) { dJointSetAMotorNumAxes(pointor, num); return this; }
				this.getNumAxes  = function() { return dJointGetAMotorNumAxes(pointor); }
				this.setAxis = function(anum, rel, x, y, z) { dJointSetAMotorAxis(pointor, anum, rel, x, y, z); return this; }
				this.getAxis = function( anum) {
					dJointGetAMotorAxis(pointor, anum,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				this.getAxisRel = function( anum) { return dJointGetAMotorAxisRel(pointor, anum); }
				this.setAngle = function(anum, angle) { dJointSetAMotorAngle(anum, angle); return this; }
				this.getAngle = function( anum) { return dJointGetAMotorAngle(pointor, anum); }
				this.getAngleRate = function( anum) { return dJointGetAMotorAngleRate(pointor, anum); }
				break;
				
			default:
				break;
		}
	}
	/**************                                   Contact Object                                   *********************/
	var sizeOfCantact= 104;
	
	ODE.Contact = (function()
	{
		var contact = function(/*pointor*/)
		{
			var pointor = arguments[0] ||  Module._malloc(sizeOfCantact);
			this.getPointor = function() { return pointor;}
			this.surface = {};
			Object.defineProperties(this.surface, {
				mode : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor,'i32') },
					set : function(val) {  	 Module.setValue(pointor,val,'i32')	}
				},
				mu : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+4,'float') },
					set : function(val) {  	 Module.setValue(pointor+4,val,'float')	}
				},
				mu2 : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+8,'float') },
					set : function(val) {  	 Module.setValue(pointor+8,val,'float')	}
				},
				bounce : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+12,'float') },
					set : function(val) {  	 Module.setValue(pointor+12,val,'float')	}
				},
				bounce_vel : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+16,'float') },
					set : function(val) {  	 Module.setValue(pointor+16,val,'float')	}
				},
				soft_erp : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+20,'float') },
					set : function(val) {  	 Module.setValue(pointor+20,val,'float')	}
				},
				soft_cfm : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+24,'float') },
					set : function(val) {  	 Module.setValue(pointor+24,val,'float')	}
				},
				motion1 : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+28,'float') },
					set : function(val) {  	 Module.setValue(pointor+24,val,'float')	}
				},
				motion2 : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+32,'float') },
					set : function(val) {  	 Module.setValue(pointor+32,val,'float')	}
				},
				slip1 : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+36,'float') },
					set : function(val) {  	 Module.setValue(pointor+36,val,'float')	}
				},
				slip2 : {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+40,'float') },
					set : function(val) {  	 Module.setValue(pointor+40,val,'float')	}
				}
			});
			this.geom={};
			Object.defineProperties(this.geom, {
				pos : {
					enumerable : true,
					get : function(){ return [ Module.getValue(pointor+44,'float'), Module.getValue(vec4+48,'float'), Module.getValue(vec4+52,'float') ];},
					set : function(val) { Module.setValue(pointor+44,val[0],'float'), Module.setValue(pointor+48,val[1],'float'),Module.setValue(pointor+52,val[2],'float')	}
				},
				normal: {
					enumerable : true,
					get : function(){ return [ Module.getValue(pointor+60,'float'), Module.getValue(vec4+64,'float'), Module.getValue(vec4+68,'float') ];},
					set : function(val) { Module.setValue(pointor+60,val[0],'float'), Module.setValue(pointor+64,val[1],'float'),Module.setValue(pointor+68,val[2],'float')	}
				},
				depth: {
					enumerable : true,
					get : function(){ return Module.getValue(pointor+76,'float') },
					set : function(val) {  	 Module.setValue(pointor+76,val,'float')	}
				},
				g1 : {
					enumerable : true,
					get : function()
					{ 
						var p = Module.getValue(pointor+80,'i32');
						return (p)? new Geom(p) : null;
					},
					set : function(val) {  	 Module.setValue(pointor+80,val.getPointor(),'i32')	}
				},
				g2  : {
					enumerable : true,
					get : function()
					{ 
						var p =  Module.getValue(pointor+84,'i32');
						return (p)? new Geom(p) : null;
					},
					set : function(val) {  	 Module.setValue(pointor+84,val.getPointor(),'i32')	}
				}
			});
			Object.defineProperty(this,"fdir1",{
				enumerable : true,
				get : function(){ return [ Module.getValue(pointor+88,'float'), Module.getValue(vec4+92,'float'), Module.getValue(vec4+96,'float') ];},
				set : function(val) { Module.setValue(pointor+88,val[0],'float'), Module.setValue(pointor+92,val[1],'float'),Module.setValue(pointor+96,val[2],'float')	}
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
	
	function Body(pointor)
	{
		this.getPointor = function() { return pointor;}
		this.destroy = function() { dBodyDestroy(pointor)}
		this.setPosition = function(x,y,z) { dBodySetPosition(pointor,x,y,z); return this; }
		this.setRotation = function(rotation) { dBodySetRotation(pointor, rotation.getPointor()); return this;}
		this.setQuaternion = function(quat) {	dBodySetQuaternion(pointor,quat.getPointor()); return this;}
		this.setLinearVel = function(x,y,z) { dBodySetLinearVel(pointor,x,y,z); return this; }
		this.setAngularVel = function(x,y,z) { dBodySetAngularVel(pointor,x,y,z); return this; }
			
		this.getPosition = function()
		{
			var p = dBodyGetPosition(pointor);
			return Module.HEAPF32.slice(p/4,p/4+3);
		}
			
		this.getRotation = function()
		{
			return new ODE.Rotation(dBodyGetRotation(pointor));
		}
		
		this.getQuaternion = function()
		{
			return new ODE.Quaternion(dBodyGetQuaternion(pointor));
		}
		
		this.getLinearVel = function()
		{
			var p = dBodyGetLinearVel(pointor);
			return Module.HEAPF32.slice(p/4,p/4+3);
		}
		
		this.getAngularVel = function()
		{
			var p = dBodyGetAngularVel(pointor);
			return Module.HEAPF32.slice(p/4,p/4+3);
		}
		
		this.setMass = function(mass) {	dBodySetMass(pointor,mass.getPointor()); return this;}
		this.getMass = function(body) 
		{
			dBodyGetMass(body,mass)
			return new ODE.Mass(mass);
		}
		
		this.addForce = function( fx, fy, fz)   {	dBodyAddForce(pointor,fx, fy, fz); return this;}
		this.addTorque  = function( fx, fy, fz)   { dBodyAddTorque(pointor,fx, fy, fz); return this;}
		this.addRelForce  = function( fx, fy, fz) {	dBodyAddRelForce(pointor,fx, fy, fz); return this;}
		this.addRelTorque = function( fx, fy, fz) {	dBodyAddRelTorque(pointor,fx, fy, fz); return this;}
		
		this.addForceAtPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddForceAtPos(pointor,fx, fy, fz, px, py, pz); return this;}
		this.addForceAtRelPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddForceAtRelPos(pointor,fx, fy, fz, px, py, pz); return this;} 
		this.addRelForceAtPos = function( fx, fy, fz, px, py, pz)   {	dBodyAddRelForceAtPos(pointor,fx, fy, fz, px, py, pz); return this;} 
		this.addRelForceAtRelPos = function( fx, fy, fz, px, py, pz){	dBodyAddRelForceAtRelPos(pointor,fx, fy, fz, px, py, pz); return this;} 
		
		this.getForce = function()
		{
			var p = dBodyGetForce(pointor);
			return Module.HEAPF32.slice(p/4,p/4+3);
		}
		
		this.getTorque = function()
		{
			var p = dBodyGetTorque(pointor);
			return Module.HEAPF32.slice(p/4,p/4+3);
		}
		
		this.getRelPointPos = function( px, py, pz) {
			dBodyGetRelPointPos(pointor, px, py, pz, vec4);
			return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
		}
		
		this.getRelPointVel = function( px, py, pz) {
			dBodyGetRelPointVel(pointor, px, py, pz, vec4);
			return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
		}
		
		this.enable = function() { dBodyEnable(pointor); return this; } 
		this.disable = function() { dBodyDisable(pointor); return this; } 
		this.isEnabled = function() { return dBodyIsEnabled(pointor);  } 
		
		this.getNumJoints = function() { return dBodyGetNumJoints(pointor);  } 
		this.getJoint = function(idx) 
		{ 
			var j = dBodyGetJoint(pointor,idx);
			return (j)? new Joint() : null;
		}  
		
	}
	ODE.Body = { areConnected : function(b1,b2) { return dAreConnected((b1)? b1.getPointor() : 0, (b2)? b2.getPointor() : 0 ); } };
	
	/**************                                   World API                                   *********************/
	var dWorldCreate = Module.cwrap('dWorldCreate','number',[]);
	var dWorldDestroy =  Module.cwrap('dWorldDestroy',null,['number']);
	var dWorldSetGravity = Module.cwrap('dWorldSetGravity',null,['number','number','number','number']);
	var dWorldGetGravity = Module.cwrap('dWorldGetGravity',null,['number','number']);
	var dWorldSetERP = Module.cwrap('dWorldSetERP',null,['number','number']);
	var dWorldGetERP = Module.cwrap('dWorldGetERP','number',['number']);
	var dWorldSetCFM = Module.cwrap('dWorldSetCFM',null,['number','number']);
	var dWorldGetCFM = Module.cwrap('dWorldGetCFM','number',['number']);
	var dWorldStep =  Module.cwrap('dWorldStep',null,['number','number']);
	
	ODE.World = function ()
	{
		var pointor = arguments[0] || dWorldCreate();
		this.getPointor = function() { return pointor;}
		this.destroy = function() { dWorldDestroy(pointor)}
		this.setGravity = function(x,y,z) {dWorldSetGravity(pointor,x,y,z); return this; }
		this.getGravity = function() {
			dWorldGetGravity(pointor,vec4);
			return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
		}
		Object.defineProperties(this, {
			ERP : {
				enumerable : true,
				get : function(){ return dWorldGetERP(pointor) },
				set : function(val) {  	dWorldSetERP(pointor,val);}
			},
			CFM : {
				enumerable : true,
				get : function(){ return dWorldGetCFM(pointor) },
				set : function(val) {  	 dWorldSetCFM(pointor,val)	}
			}
		})
		this.step = function(stepsize) { dWorldStep(pointor,stepsize); return this; }
		this.createBody = function() { return new Body(dBodyCreate(pointor));}
		this.createBallJoint = function(group) { return new Joint(dJointCreateBall(pointor, (group)? group.getPointor() : 0)); }
		this.createHingeJoint = function(group) { return new Joint(dJointCreateHinge(pointor, (group)? group.getPointor() : 0)); } 
		this.createSliderJoint = function(group) { return new Joint(dJointCreateSlider(pointor, (group)? group.getPointor() : 0)); }
		this.createContactJoint = function( group, contact) {
			return new Joint(dJointCreateContact( pointor, (group)? group.getPointor() : 0, contact.getPointor()));
		}
		this.createHinge2Joint = function(group) { return new Joint(dJointCreateHinge2(pointor, (group)? group.getPointor() : 0)); }
		this.createFixedJoint = function(group) { return new Joint(dJointCreateFixed(pointor, (group)? group.getPointor() : 0)); } 
		this.createNullJoint = function(group) { return new Joint(dJointCreateNull(pointor, (group)? group.getPointor() : 0)); } 
		this.createAMotorJoint = function(group) { return new Joint(dJointCreateAMotor(pointor, (group)? group.getPointor() : 0)); }
	}
	
	/**************                                   Geom API                                   *********************/
	var dCreateSphere = Module.cwrap('dCreateSphere','number',['number','number']);
	var dCreateBox = Module.cwrap('dCreateBox','number',['number','number','number','number']);
	var dCreatePlane = Module.cwrap('dCreatePlane','number',['number','number','number','number','number']);
	var dCreateCCylinder = Module.cwrap('dCreateCCylinder','number',['number','number','number']);
	var dCreateGeomGroup = Module.cwrap('dCreateGeomGroup','number',['number']);
	var dCreateGeomTransform =  Module.cwrap('dCreateGeomTransform','number',['number']);
	var dGeomSetData = Module.cwrap('dGeomSetData',null,['number','number']);
	var dGeomGetData = Module.cwrap('dGeomGetData','number',['number']);
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
	var dGeomCCylinderSetParams = Module.cwrap('dGeomCCylinderSetParams',null,['number','number','number']);
	var dGeomSphereGetRadius = Module.cwrap('dGeomSphereGetRadius','number',['number']);
	var dGeomBoxGetLengths = Module.cwrap('dGeomBoxGetLengths',null,['number','number']);
	var dGeomPlaneGetParams = Module.cwrap('dGeomPlaneGetParams',null,['number','number']);
	var dGeomCCylinderGetParams = Module.cwrap('dGeomCCylinderGetParams',null,['number','number', 'number']);
	var dGeomGroupAdd = Module.cwrap('dGeomGroupAdd',null,['number','number']);
	var dGeomGroupRemove = Module.cwrap('dGeomGroupRemove',null,['number','number']);
	var dGeomGroupGetNumGeoms = Module.cwrap('dGeomGroupGetNumGeoms','number',['number']);
	var dGeomGroupGetGeom = Module.cwrap('dGeomGroupGetGeom','number',['number','number']);
	var dGeomTransformSetGeom = Module.cwrap('dGeomTransformSetGeom',null,['number','number']);
	var dGeomTransformGetGeom = Module.cwrap('dGeomTransformGetGeom','number',['number']);
	var dGeomTransformSetCleanup = Module.cwrap('dGeomTransformSetCleanup',null,['number','number']);
	var dGeomTransformGetCleanup = Module.cwrap('dGeomTransformGetCleanup','number',['number']);
	var dCollide = Module.cwrap('dCollide','number',['number','number', 'number', 'number', 'number']);
	
	ODE.Geom = {
		Types : {
			Unknown 	:0,
			Sphere 		:1,
			Box			:2,
			CCylinder 	:3,
			Plan 		:4,
			Group 		:5,
			Transform 	:6
		},
		
		collide : function(g1, g2, MaxContact, contactCB)
		{
			var contacts = Module._malloc(MaxContact * sizeOfCantact);
			var n = dCollide((g1)? g1.getPointor() : 0 , (g2)? g2.getPointor() : 0 , MaxContact, contacts+44, sizeOfCantact);
			for(var i=0;i<n;i++)
			{
				contactCB(new ODE.Contact(contacts+i*sizeOfCantact));
			}
			Module._free(contacts);
		}
	}
	
	function Geom(pointor)
	{
		var type = dGeomGetData(pointor);
		this.getPointor = function() { return pointor; }
		this.destroy = function() { dGeomDestroy(pointor);}
		Object.defineProperty(this,"type",{
			value : type,
			writable : false,
			enumerable : true,
			configurable : false
		});
		this.setPosition = function(x,y,z) { dGeomSetPosition(pointor,x,y,z); return this; }
		this.setRotation = function(rotation) { dGeomSetRotation(pointor, rotation.getPointor()); return this;}
			
		this.getPosition = function()
		{
			var p = dGeomGetPosition(pointor);
			return Module.HEAPF32.slice(p/4,p/4+3);
		}
			
		this.getRotation = function()
		{
			return new ODE.Rotation(dGeomGetRotation(pointor));
		}
		this.setBody = function(body) { dGeomSetBody(pointor, body.getPointor()); return this;}
		this.getBody  = function()
		{
			var b = dGeomGetBody(pointor);
			return (b)? new Body(b) : null;
		}
		this.getAABB = function()
		{
			dGeomGetAABB(pointor,vec6);
			return getVec6();
		}
		this.getSpaceAABB = function()
		{
			var p = dGeomGetSpaceAABB(pointor);
			return Module.HEAPF32.slice(p/4,p/4+6);
		}
		switch(type)
		{
			case ODE.Geom.Types.Sphere :
				Object.defineProperty(this,"radius" ,{
					enumerable : true,
					get : function(){ return dGeomSphereSetRadius(pointor) },
					set : function(val) {  	dGeomSphereGetRadius(pointor,val);}
				});
				break;
			
			case ODE.Geom.Types.Box :
				this.setLengths = function(x,y,z) {dGeomBoxSetLengths(pointor,x,y,z); return this; }
				this.getLengths = function() {
					dGeomBoxGetLengths(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
				}
				break;
			
			case ODE.Geom.Types.CCylinder :
				this.setParams = function(radius, length) {dGeomCCylinderSetParams(pointor,radius, length); return this; }
				this.getParams = function()
				{
					dGeomCCylinderGetParams(pointor,vec4,vec4+4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float')];
				}
				break;
			
			case ODE.Geom.Types.Plan :
				this.setParams = function(a, b, c, d) {dGeomPlaneSetParams(pointor,a, b, c, d); return this; }
				this.getParams = function()
				{
					dGeomPlaneGetParams(pointor,vec4);
					return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float'), Module.getValue(vec4+12,'float') ];
				}
				break;
			
			case ODE.Geom.Types.Group :
				this.add = function(geom) { dGeomGroupAdd(pointor, geom.getPointor()); return this; }
				this.remove = function(geom) { dGeomGroupRemove(pointor, geom.getPointor()); return this; }
				Object.defineProperty(this,"numGeoms" ,{
					enumerable : true,
					get : function(){ return dGeomGroupGetNumGeoms(pointor) }
				});
				this.getGeom = function(idx) 
				{
					var g = dGeomGroupGetGeom(pointor, idx);
					return (g)? new Geom(g) : null;
				}
				break;
				
			case ODE.Geom.Types.Transform :
				this.setGeom = function(geom) { dGeomTransformSetGeom(pointor, geom.getPointor()); return this; }
				this.getGeom = function() 
				{
					var g = dGeomTransformGetGeom(pointor);
					return (g)? new Geom(g) : null;
				}
				Object.defineProperty(this,"cleanup" ,{
					enumerable : true,
					get : function(){ return dGeomTransformGetCleanup(pointor) },
					set : function(val) {  	dGeomTransformSetCleanup(pointor,val);}
				});
				break;
			
			default:
				break;
		}
	}
	
	ODE.Geom.createSphere = function(radius)
	{
		var g= dCreateSphere(0,radius)
		dGeomSetData(g,ODE.Geom.Types.Sphere);
		return new Geom(g);
	}
	
	ODE.Geom.createBox = function(lx,ly,lz)
	{
		var g = dCreateBox(0,lx,ly,lz);
		dGeomSetData(g,ODE.Geom.Types.Box);
		return new Geom(g);
	}
	
	ODE.Geom.createCCylinder = function(radius, length)
	{
		var g = dCreateCCylinder(0, radius, length);
		dGeomSetData(g,ODE.Geom.Types.CCylinder);
		return new Geom(g);
	}
	
	ODE.Geom.createPlane = function(a, b, c, d)
	{
		var g = dCreatePlane(0, a, b, c, d);
		dGeomSetData(g,ODE.Geom.Types.Plan);
		return new Geom(g);
	}
	
	ODE.Geom.createGroup = function()
	{
		var g = dCreateGeomGroup(0);
		dGeomSetData(g,ODE.Geom.Types.Group);
		return new Geom(g);
	}
	
	ODE.Geom.createTransform = function()
	{
		var g = dCreateGeomTransform(0);
		dGeomSetData(g,ODE.Geom.Types.Transform);
		return new Geom(g);
	} 
	
	/**************                                   Space API                                   *********************/
	var dSimpleSpaceCreate = Module.cwrap('dSimpleSpaceCreate','number',[]);
	var dHashSpaceCreate =  Module.cwrap('dHashSpaceCreate','number',[]);
	var dSpaceDestroy = Module.cwrap('dSpaceDestroy',null,['number']);
	var dSpaceAdd = Module.cwrap('dSpaceAdd',null,['number','number']);
	var dSpaceRemove = Module.cwrap('dSpaceRemove',null,['number','number']);
	var dHashSpaceSetLevels =  Module.cwrap('dHashSpaceSetLevels',null,['number','number','number']);
	var dSpaceCollide = Module.cwrap('dSpaceCollide',null,['number','number','number']);
	
	function Space(pointor)
	{
		this.getPointor = function() { return pointor;}
		this.destroy = function() { dSpaceDestroy(pointor); }
		this.add = function(geom) { dSpaceAdd(pointor, geom.getPointor()); return this; }
		this.remove = function(geom) { dSpaceRemove(pointor, geom.getPointor()); return this; }
		this.collide = function( nearCallback)
		{
			var ptrFunc = Runtime.addFunction(function(data,g1,g2)
			{
				var geom1 = (g1)? new Geom(g1) : null;
				var geom2 = (g2)? new Geom(g2) : null;
				if(geom1 && geom2)
					nearCallback(geom1, geom2)
			});
			dSpaceCollide(pointor,0,ptrFunc);
			Runtime.removeFunction(ptrFunc);
		}
		this.createSphere = function(radius)
		{
			var g= dCreateSphere(pointor,radius)
			dGeomSetData(g,ODE.Geom.Types.Sphere);
			return new Geom(g);
		}
		
		this.createBox = function(lx,ly,lz)
		{
			var g = dCreateBox(pointor,lx,ly,lz);
			dGeomSetData(g,ODE.Geom.Types.Box);
			return new Geom(g);
		}
		
		this.createCCylinder = function(radius, length)
		{
			var g = dCreateCCylinder(pointor, radius, length);
			dGeomSetData(g,ODE.Geom.Types.CCylinder);
			return new Geom(g);
		}
		
		this.createPlane = function(a, b, c, d)
		{
			var g = dCreatePlane(pointor, a, b, c, d);
			dGeomSetData(g,ODE.Geom.Types.Plan);
			return new Geom(g);
		}
		
		this.createGroup = function()
		{
			var g = dCreateGeomGroup(pointor);
			dGeomSetData(g,ODE.Geom.Types.Group);
			return new Geom(g);
		}
		
		this.createTransform = function()
		{
			var g = dCreateGeomTransform(pointor);
			dGeomSetData(g,ODE.Geom.Types.Transform);
			return new Geom(g);
		} 
	}
	
	ODE.Space = {
		Simple : function() { Space.call(this,dSimpleSpaceCreate()); },
		Hash : function()
		{
			Space.call(this,dSimpleSpaceCreate());
			this.setHashLevels = function(minlevel, maxlevel) { dHashSpaceSetLevels(this.getPointor(), minlevel, maxlevel); return this; }
		}
	};
	
	if (ENVIRONMENT_IS_NODE)
		module.exports = ODE;
	
	return ODE;

})()