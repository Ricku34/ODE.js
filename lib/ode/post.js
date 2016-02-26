
	var vec4 = Module._malloc(4*4);
	var mat3 = Module._malloc(4*3*4);
	var mass = Module._malloc((1+4+4*3)*4);
	
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
	
	function getMat3()
	{
		var mat = new Array(12);
		for(var i=0;i<12;i++)
			mat[i] = Module.getValue(mat3+i*4, 'float');
		return mat;
	}
		
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
	
	var ODE = {
		Module : Module,
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
		Boby : {
			create : Module.cwrap('dBodyCreate','number',['number']),
			destroy : Module.cwrap('dBodyDestroy',null,['number']),
			
			setPosition : Module.cwrap('dBodySetPosition',null,['number','number','number','number']),
			setRotation : function(world,rotation) { dBodySetRotation(world, setMat3(rotation));	},
			setQuaternion : function(world,quat) {	dBodySetQuaternion(world,setVec4(quat));	},
			setLinearVel : Module.cwrap('dBodySetLinearVel',null,['number','number','number','number']),
			setAngularVel : Module.cwrap('dBodySetAngularVel',null,['number','number','number','number']),
			
			getPosition : function(body)
			{
				var p = dBodyGetPosition(body);
				return Module.HEAPF32.slice(p/4,p/4+3);
			},
			
			getRotation : function(body)
			{
				var p = dBodyGetRotation(body);
				return Module.HEAPF32.slice(p/4,p/4+12);
			},
			
			getQuaternion : function(body)
			{
				var p = dBodyGetQuaternion(body);
				return Module.HEAPF32.slice(p/4,p/4+4);
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
			createBall : Module.cwrap('dJointCreateBall','number',['number']),
			createHinge : Module.cwrap('dJointCreateHinge','number',['number']),
			createSlider : Module.cwrap('dJointCreateSlider','number',['number']),
			createContact : Module.cwrap('dJointCreateContact','number',['number', 'number']),
			createHinge2 : Module.cwrap('dJointCreateHinge2','number',['number']),
			createFixed : Module.cwrap('dJointCreateFixed','number',['number']),
			createNull : Module.cwrap('dJointCreateNull','number',['number']),
			createAMotor : Module.cwrap('dJointCreateAMotor','number',['number']),
			destroyJoint : Module.cwrap('dJointDestroy',null,['number']),
			destroyGroup : Module.cwrap('dJointGroupDestroy',null,['number']),
			emptyGroup : Module.cwrap('dJointGroupEmpty',null,['number']),
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
			setAMotorMode : Module.cwrap('dJointSetAMotorMode',null,['number','number'])
		}
		
	}
	if (ENVIRONMENT_IS_NODE)
		module.exports = ODE;
	
	return ODE;

})()