
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
	
	return {
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
			setZero : Module.cwrap('dMassSetZero',null,['number']),
			setParameters : Module.cwrap('dMassSetParameters',null,['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']),
			setSphere : Module.cwrap('dMassSetSphere',null,['number', 'number', 'number']),
			setCappedCylinder : Module.cwrap('dMassSetCappedCylinder',null,['number', 'number', 'number', 'number', 'number']),
			setBox : Module.cwrap('dMassSetBox',null,['number', 'number', 'number', 'number', 'number']),
			adjust : Module.cwrap('dMassAdjust',null,['number', 'number']),
			translate : Module.cwrap('dMassTranslate',null,['number', 'number', 'number', 'number']),
			rotate : function(mass,rotation) { dMassRotate(mass, setMat3(rotation));},
			add : Module.cwrap('dMassAdd',null,['number', 'number'])
		}
	}

})()