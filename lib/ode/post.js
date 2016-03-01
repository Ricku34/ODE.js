
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
	var sizeOfCantact= 104;
	var sizeOfRotation = 4*3*4;	
	var sizeOfQuaternion = 4*4;
	
	var dWorldGetGravity = Module.cwrap('dWorldGetGravity',null,['number','number']);
	var dBodySetRotation = Module.cwrap('dBodySetRotation',null,['number','number']);
	var dBodySetQuaternion = Module.cwrap('dBodySetQuaternion',null,['number','number']);
	var dBodyGetPosition = Module.cwrap('dBodyGetPosition','number',['number']);
	var dBodyGetRotation = Module.cwrap('dBodyGetRotation','number',['number']);
	var dBodyGetQuaternion = Module.cwrap('dBodyGetQuaternion','number',['number']);
	var dBodyGetLinearVel = Module.cwrap('dBodyGetLinearVel','number',['number']);
	var dBodyGetAngularVel = Module.cwrap('dBodyGetAngularVel','number',['number']);
	var dBodyGetMass = Module.cwrap('dBodyGetMass',null,['number','number']);
	var dBodyGetForce = Module.cwrap('dBodyGetForce','number',['number']);
	var dBodyGetTorque = Module.cwrap('dBodyGetTorque','number',['number']);
	var dBodyGetRelPointPos = Module.cwrap('dBodyGetRelPointPos',null,['number','number','number','number','number']);
	var dBodyGetRelPointVel = Module.cwrap('dBodyGetRelPointVel',null,['number','number','number','number','number']);
	var dMassRotate = Module.cwrap('dMassRotate',null,['number', 'number']);
	var dJointCreateContact = Module.cwrap('dJointCreateContact','number',['number', 'number' , 'number'])
	var dJointGetBallAnchor = Module.cwrap('dJointGetBallAnchor',null,['number','number']);
	var dJointGetHingeAnchor = Module.cwrap('dJointGetHingeAnchor',null,['number','number']);
	var dJointGetHingeAxis = Module.cwrap('dJointGetHingeAxis',null,['number','number']);
	var dJointGetSliderAxis = Module.cwrap('dJointGetSliderAxis',null,['number','number']);
	var dJointGetHinge2Anchor = Module.cwrap('dJointGetHinge2Anchor',null,['number','number']);
	var dJointGetHinge2Axis1 = Module.cwrap('dJointGetHinge2Axis1',null,['number','number']);
	var dJointGetHinge2Axis2 = Module.cwrap('dJointGetHinge2Axis2',null,['number','number']);
	var dJointGetAMotorAxis = Module.cwrap('dJointGetAMotorAxis',null,['number','number','number']);
	var dSpaceCollide = Module.cwrap('dSpaceCollide',null,['number','number','number']);
	var dGeomSetRotation = Module.cwrap('dGeomSetRotation',null,['number','number']);
	var dGeomGetPosition = Module.cwrap('dGeomGetPosition','number',['number']);
	var dGeomGetRotation = Module.cwrap('dGeomGetRotation','number',['number']);
	var dGeomGetAABB = Module.cwrap('dGeomGetAABB',null,['number','number']);
	var dGeomGetSpaceAABB = Module.cwrap('dGeomGetRotation','number',['number']);
	var dGeomBoxGetLengths = Module.cwrap('dGeomBoxGetLengths',null,['number','number']);
	var dGeomPlaneGetParams = Module.cwrap('dGeomPlaneGetParams',null,['number','number']);
	var dGeomCCylinderGetParams = Module.cwrap('dGeomCCylinderGetParams',null,['number','number', 'number']);
	var dCollide = Module.cwrap('dCollide','number',['number','number', 'number', 'number', 'number']);
	var dRSetIdentity = Module.cwrap('dRSetIdentity',null,['number']);
	var dRFromAxisAndAngle = Module.cwrap('dRFromAxisAndAngle',null,['number', 'number', 'number', 'number', 'number']);
	var dRFromEulerAngles = Module.cwrap('dRFromEulerAngles',null,['number', 'number', 'number', 'number']);
	var dRFrom2Axes = Module.cwrap('dRFrom2Axes',null,['number', 'number', 'number', 'number', 'number', 'number', 'number']);
	var dQSetIdentity = Module.cwrap('dQSetIdentity',null,['number']);
	var dQFromAxisAndAngle = Module.cwrap('dQFromAxisAndAngle',null,['number', 'number', 'number', 'number', 'number']);
	
	var ODE = {
		Module : Module,
		Runtime : Runtime,
		/**************                                   World API                                   *********************/
		World : {
			create : Module.cwrap('dWorldCreate','number',[]),
			destroy : Module.cwrap('dWorldCreate',null,['number']),
			setGravity : Module.cwrap('dWorldSetGravity',null,['number','number','number','number']),
			getGravity : function(world) {
				dWorldGetGravity(world,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			setERP : Module.cwrap('dWorldSetERP',null,['number','number']),
			getERP : Module.cwrap('dWorldGetERP','number',['number']),
			setCFM : Module.cwrap('dWorldSetCFM',null,['number','number']),
			getCFM : Module.cwrap('dWorldGetCFM','number',['number']),
			step : Module.cwrap('dWorldStep',null,['number','number'])
		},
		
		/**************                                   Body API                                   *********************/
		Body : {
			create : Module.cwrap('dBodyCreate','number',['number']),
			destroy : Module.cwrap('dBodyDestroy',null,['number']),
			
			setPosition : Module.cwrap('dBodySetPosition',null,['number','number','number','number']),
			setRotation : function(world,rotation) { dBodySetRotation(world, rotation.getPointor());	},
			setQuaternion : function(world,quat) {	dBodySetQuaternion(world,quat.getPointor());	},
			setLinearVel : Module.cwrap('dBodySetLinearVel',null,['number','number','number','number']),
			setAngularVel : Module.cwrap('dBodySetAngularVel',null,['number','number','number','number']),
			
			getPosition : function(body)
			{
				var p = dBodyGetPosition(body);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			
			getRotation : function(body)
			{
				return new ODE.Rotation(dBodyGetRotation(body));
			},
			
			getQuaternion : function(body)
			{
				return new ODE.Quaternion(dBodyGetQuaternion(body));
			},
			
			getLinearVel : function(body)
			{
				var p = dBodyGetLinearVel(body);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			
			getAngularVel : function(body)
			{
				var p = dBodyGetAngularVel(body);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			
			setMass : Module.cwrap('dBodySetMass',null,['number','number']),
			getMass : function(body) 
			{
				dBodyGetMass(body,mass)
				return mass;
			},
			
			addForce : Module.cwrap('dBodyAddForce',null,['number','number','number','number']),
			addTorque : Module.cwrap('dBodyAddTorque',null,['number','number','number','number']),
			addRelForce : Module.cwrap('dBodyAddRelForce',null,['number','number','number','number']),
			addRelTorque : Module.cwrap('dBodyAddRelTorque',null,['number','number','number','number']),
			
			addForceAtPos : Module.cwrap('dBodyAddForceAtPos',null,['number','number','number','number','number','number','number']),
			addForceAtRelPos : Module.cwrap('dBodyAddForceAtRelPos',null,['number','number','number','number','number','number','number']),
			addRelForceAtPos : Module.cwrap('dBodyAddRelForceAtPos',null,['number','number','number','number','number','number','number']),
			addRelForceAtRelPos : Module.cwrap('dBodyAddRelForceAtRelPos',null,['number','number','number','number','number','number','number']),
			
			getForce : function(body)
			{
				var p = dBodyGetForce(body);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			
			getTorque : function(body)
			{
				var p = dBodyGetTorque(body);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			
			getRelPointPos : function(body, px, py, pz) {
				dBodyGetRelPointPos(body, px, py, pz, vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			
			getRelPointVel : function(body, px, py, pz) {
				dBodyGetRelPointVel(body, px, py, pz, vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			
			areConnected : Module.cwrap('dAreConnected','number',['number','number']),
			enable : Module.cwrap('dBodyEnable',null,['number']),
			disable : Module.cwrap('dBodyDisable',null,['number']),
			isEnabled : Module.cwrap('dBodyIsEnabled','number',['number'])
			
		},
		
		/**************                                   Mass API                                   *********************/
		Mass : {
			create : function() {	return Module._malloc((1+4+4*3)*4); },
			destroy : function(mass) { return Module._free(mass); },
			setZero : Module.cwrap('dMassSetZero',null,['number']),
			setParameters : Module.cwrap('dMassSetParameters',null,['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']),
			setSphere : Module.cwrap('dMassSetSphere',null,['number', 'number', 'number']),
			setCappedCylinder : Module.cwrap('dMassSetCappedCylinder',null,['number', 'number', 'number', 'number', 'number']),
			setBox : Module.cwrap('dMassSetBox',null,['number', 'number', 'number', 'number', 'number']),
			adjust : Module.cwrap('dMassAdjust',null,['number', 'number']),
			translate : Module.cwrap('dMassTranslate',null,['number', 'number', 'number', 'number']),
			rotate : function(mass,rotation) { dMassRotate(mass, setMat3(rotation));},
			add : Module.cwrap('dMassAdd',null,['number', 'number'])
		},
		
		/**************                                   Joint API                                   *********************/
		Joint : {
			createGroup : Module.cwrap('dJointGroupCreate','number',['number']),
			createBall : Module.cwrap('dJointCreateBall','number',['number', 'number']),
			createHinge : Module.cwrap('dJointCreateHinge','number',['number', 'number']),
			createSlider : Module.cwrap('dJointCreateSlider','number',['number', 'number']),
			createContact : function( world, group, contact) {
				return dJointCreateContact( world, group, contact.getPointor());
			},
			createHinge2 : Module.cwrap('dJointCreateHinge2','number',['number', 'number']),
			createFixed : Module.cwrap('dJointCreateFixed','number',['number', 'number']),
			createNull : Module.cwrap('dJointCreateNull','number',['number', 'number']),
			createAMotor : Module.cwrap('dJointCreateAMotor','number',['number', 'number']),
			destroyJoint : Module.cwrap('dJointDestroy',null,['number']),
			destroyGroup : Module.cwrap('dJointGroupDestroy',null,['number']),
			emptyGroup : Module.cwrap('dJointGroupEmpty',null,['number']),
			attach : Module.cwrap('dJointAttach',null,['number', 'number' , 'number']),
			getType : Module.cwrap('dJointGetType','number',['number']),
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
			getBody : Module.cwrap('dJointGetBody','number',['number', 'number']),
			setBallAnchor : Module.cwrap('dJointSetBallAnchor',null,['number','number','number','number']),
			setHingeAnchor : Module.cwrap('dJointSetHingeAnchor',null,['number','number','number','number']),
			setHingeAxis : Module.cwrap('dJointSetHingeAxis',null,['number','number','number','number']),
			setSliderAxis : Module.cwrap('dJointSetSliderAxis',null,['number','number','number','number']),
			setHinge2Anchor : Module.cwrap('dJointSetHinge2Anchor',null,['number','number','number','number']),
			setHinge2Axis1 : Module.cwrap('dJointSetHinge2Axis1',null,['number','number','number','number']),
			setHinge2Axis2 : Module.cwrap('dJointSetHinge2Axis2',null,['number','number','number','number']),
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
			setHingeParam : Module.cwrap('dJointSetHingeParam',null,['number','number','number']),
			setSliderParam : Module.cwrap('dJointSetSliderParam',null,['number','number','number']),
			setHinge2Param : Module.cwrap('dJointSetHinge2Param',null,['number','number','number']),
			setAMotorParam : Module.cwrap('dJointSetAMotorParam',null,['number','number','number']),
			setFixed : Module.cwrap('dJointSetFixed',null,['number']),
			setAMotorNumAxes : Module.cwrap('dJointSetAMotorNumAxes',null,['number','number']),
			setAMotorAxis : Module.cwrap('dJointSetAMotorAxis',null,['number','number','number','number','number','number']),
			setAMotorAngle : Module.cwrap('dJointSetAMotorAngle',null,['number','number','number']),
			AMotorModes : {
				User : 0,
				Euler : 1
			},
			setAMotorMode : Module.cwrap('dJointSetAMotorMode',null,['number','number']),
			
			getBallAnchor : function(joint) {
				dJointGetBallAnchor(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getHingeAnchor : function(joint) {
				dJointGetHingeAnchor(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getHingeAxis : function(joint) {
				dJointGetHingeAxis(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getSliderAxis : function(joint) {
				dJointGetSliderAxis(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getHinge2Anchor : function(joint) {
				dJointGetHinge2Anchor(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getHinge2Axis1 : function(joint) {
				dJointGetHinge2Axis1(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getHinge2Axis2 : function(joint) {
				dJointGetHinge2Axis2(joint,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getAMotorAxis : function(joint, anum) {
				dJointGetAMotorAxis(joint, anum,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getHingeParam : Module.cwrap('dJointGetHingeParam','number',['number', 'number']),
			getSliderParam : Module.cwrap('dJointGetSliderParam','number',['number', 'number']),
			getHinge2Param : Module.cwrap('dJointGetHinge2Param','number',['number', 'number']),
			getAMotorParam : Module.cwrap('dJointGetAMotorParam','number',['number', 'number']),
			getAMotorAngle : Module.cwrap('dJointGetAMotorAngle','number',['number', 'number']),
			getAMotorAngleRate : Module.cwrap('dJointGetAMotorAngleRate','number',['number', 'number']),
			getHingeAngle : Module.cwrap('dJointGetHingeAngle','number',['number']),
			getHingeAngleRate : Module.cwrap('dJointGetHingeAngleRate','number',['number']),
			getSliderPosition : Module.cwrap('dJointGetSliderPosition','number',['number']),
			getSliderPositionRate : Module.cwrap('dJointGetSliderPositionRate','number',['number']),
			getHinge2Angle1 : Module.cwrap('dJointGetHinge2Angle1','number',['number']),
			getHinge2Angle1Rate : Module.cwrap('dJointGetHinge2Angle1Rate','number',['number']),
			getHinge2Angle2Rate : Module.cwrap('dJointGetHinge2Angle2Rate','number',['number']),
			getAMotorNumAxes : Module.cwrap('dJointGetAMotorNumAxes','number',['number']),
			getAMotorMode : Module.cwrap('dJointGetAMotorMode','number',['number']),
			getAMotorAxisRel : Module.cwrap('dJointGetAMotorAxisRel','number',['number', 'number'])
		},
		
		/**************                                   Space API                                   *********************/
		Space : {
			createSimple : Module.cwrap('dSimpleSpaceCreate','number',[]),
			createHash : Module.cwrap('dHashSpaceCreate','number',[]),
			destroy : Module.cwrap('dSpaceDestroy',null,['number']),
			add : Module.cwrap('dSpaceAdd',null,['number','number']),
			remove : Module.cwrap('dSpaceRemove',null,['number','number']),
			setHashLevels : Module.cwrap('dHashSpaceSetLevels',null,['number','number','number']),
			collide : function(space, nearCallback)
			{
				var ptrFunc = Runtime.addFunction(nearCallback);
				dSpaceCollide(space,0,ptrFunc);
				Runtime.removeFunction(ptrFunc);
			}
		},
		
		/**************                                   Geom API                                   *********************/
		Geom : {
			createSphere : Module.cwrap('dCreateSphere','number',['number','number']),
			createBox : Module.cwrap('dCreateBox','number',['number','number','number','number']),
			createPlane : Module.cwrap('dCreatePlane','number',['number','number','number','number','number']),
			createCCylinder : Module.cwrap('dCreateCCylinder','number',['number','number','number']),
			createGroup : Module.cwrap('dCreateGeomGroup','number',['number']),
			createTransform : Module.cwrap('dCreateGeomTransform','number',['number']),
			destroy : Module.cwrap('dGeomDestroy',null,['number']),
			setPosition : Module.cwrap('dGeomSetPosition',null,['number','number','number','number']),
			setRotation : function(world,rotation) { dGeomSetRotation(world, setMat3(rotation));	},
			getPosition : function(geom)
			{
				var p = dGeomGetPosition(geom);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			getRotation : function(geom)
			{
				var p = dGeomGetRotation(geom);
				return Module.HEAPF32.slice(p/4,p/4+12);
			},
			setBody : Module.cwrap('dGeomSetBody',null,['number','number']),
			getBody : Module.cwrap('dGeomGetBody','number',['number']),
			getAABB : function(geom)
			{
				dGeomGetAABB(geom,vec6);
				return getVec6();
			},
			getSpaceAABB : function(geom)
			{
				var p = dGeomGetSpaceAABB(geom);
				return Module.HEAPF32.slice(p/4,p/4+6);
			},
			setSphereRadius : Module.cwrap('dGeomSphereSetRadius',null,['number','number']),
			setBoxLengths : Module.cwrap('dGeomBoxSetLengths',null,['number','number','number','number']),
			setPlaneParams : Module.cwrap('dGeomPlaneSetParams',null,['number','number','number','number','number']),
			setCCylinderParams : Module.cwrap('dGeomCCylinderSetParams',null,['number','number','number']),
			getSphereRadius : Module.cwrap('dGeomSphereGetRadius','number',['number']),
			getBoxLengths : function(geom)
			{
				dGeomBoxGetLengths(geom,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
			},
			getPlaneParams : function(geom)
			{
				dGeomPlaneGetParams(geom,vec4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float'), Module.getValue(vec4+12,'float') ];
			},
			getCCylinderParams : function(geom)
			{
				dGeomPlaneGetParams(geom,vec4,vec4+4);
				return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float')];
			},
			groupAdd : Module.cwrap('dGeomGroupAdd',null,['number','number']),
			groupRemove : Module.cwrap('dGeomGroupRemove',null,['number','number']),
			groupGetNumGeoms : Module.cwrap('dGeomGroupGetNumGeoms','number',['number']),
			groupGetGeom : Module.cwrap('dGeomGroupGetGeom','number',['number','number']),
			transformSetGeom : Module.cwrap('dGeomTransformSetGeom',null,['number','number']),
			transformGetGeom : Module.cwrap('dGeomTransformGetGeom','number',['number']),
			transformSetCleanup : Module.cwrap('dGeomTransformSetCleanup',null,['number','number']),
			transformGetCleanup : Module.cwrap('dGeomTransformGetCleanup','number',['number']),
			
			collide : function(g1, g2, MaxContact, contactCB)
			{
				var contacts = Module._malloc(MaxContact * sizeOfCantact);
				var n = dCollide(g1, g2, MaxContact, contacts+44, sizeOfCantact);
				for(var i=0;i<n;i++)
				{
					contactCB(new ODE.Contact(contacts+i*sizeOfCantact));
				}
				Module._free(contacts);
			}
		},
		
		Contact : (function()
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
						get : function(){ return Module.getValue(pointor+80,'i32') },
						set : function(val) {  	 Module.setValue(pointor+80,val,'i32')	}
					},
					g2  : {
						enumerable : true,
						get : function(){ return Module.getValue(pointor+84,'i32') },
						set : function(val) {  	 Module.setValue(pointor+84,val,'i32')	}
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
		})(),
		
		Rotation : function()
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
		},
		
		Quaternion : function()
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
		
		
	}
	if (ENVIRONMENT_IS_NODE)
		module.exports = ODE;
	
	return ODE;

})()