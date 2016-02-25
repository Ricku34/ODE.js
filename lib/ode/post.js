
	var vec4 = Module._malloc(4*4);
	var mat3 = Module._malloc(4*3*4);
	
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

	return {
		/**************                                   World API                                   *********************/
		worldCreate : Module.cwrap('dWorldCreate','number',[]),
		worldDestroy : Module.cwrap('dWorldCreate',null,['number']),
		worldSetGravity : Module.cwrap('dWorldSetGravity',null,['number','number','number','number']),
		worldGetGravity : function(world) {
			dWorldGetGravity(world,vec4);
			return [ Module.getValue(vec4,'float'), Module.getValue(vec4+4,'float'), Module.getValue(vec4+8,'float') ];
		},
		worldStep : Module.cwrap('dWorldStep',null,['number','number']),
		
		/**************                                   Body API                                   *********************/
		bodyCreate : Module.cwrap('dBodyCreate','number',['number']),
		bodyDestroy : Module.cwrap('dBodyDestroy',null,['number']),
		
		bodySetPosition : Module.cwrap('dBodySetPosition',null,['number','number','number','number']),
		bodySetRotation : function(world,rotation) { dBodySetRotation(world, setMat3(rotation));	},
		bodySetQuaternion : function(world,quat) {	dBodySetQuaternion(world,setVec4(quat));	},
		bodySetLinearVel : Module.cwrap('dBodySetLinearVel',null,['number','number','number','number']),
		bodySetAngularVel : Module.cwrap('dBodySetAngularVel',null,['number','number','number','number'])
	}

})()