
	ODE.ready = true;
	_resolve(ODE);
	});
	
	if (ENVIRONMENT_IS_NODE)
		module.exports = ODE;
	
	return ODE;

})()