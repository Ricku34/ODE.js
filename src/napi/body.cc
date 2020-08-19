
#include "ode-napi.h"

Napi::Value PositionGetter(const Napi::CallbackInfo &info)
{
	return toJsVec3(info.Env(), dBodyGetPosition((dBodyID)info.Data()));
}

void PositionSetter(const Napi::CallbackInfo &info)
{
	dVector3 vec;
	getVec3(info, vec);
	dBodySetPosition((dBodyID)info.Data(), vec[0], vec[1], vec[2]);
}

Napi::Value RotationGetter(const Napi::CallbackInfo &info)
{
	return toJsMat3(info.Env(), dBodyGetRotation((dBodyID)info.Data()));
}

void RotationSetter(const Napi::CallbackInfo &info)
{
	dMatrix3 mat;
	getMat3(info, mat);
	dBodySetRotation((dBodyID)info.Data(), mat);
}

Napi::Value QuaternionGetter(const Napi::CallbackInfo &info)
{
	return toJsVec4(info.Env(), dBodyGetQuaternion((dBodyID)info.Data()));
}

void QuaternionSetter(const Napi::CallbackInfo &info)
{
	dQuaternion quat;
	getVec4(info, quat);
	dBodySetQuaternion((dBodyID)info.Data(), quat);
}

void finalizeBody(Napi::Env env, dBodyID body)
{
	dBodyDestroy(body);
}

Napi::Value LinearVelGetter(const Napi::CallbackInfo &info)
{
	return toJsVec3(info.Env(), dBodyGetLinearVel((dBodyID)info.Data()));
}

void LinearVelSetter(const Napi::CallbackInfo &info)
{
	dVector3 vec;
	getVec3(info, vec);
	dBodySetLinearVel((dBodyID)info.Data(), vec[0], vec[1], vec[2]);
}

Napi::Value AngularVelGetter(const Napi::CallbackInfo &info)
{
	return toJsVec3(info.Env(), dBodyGetAngularVel((dBodyID)info.Data()));
}

void AngularVelSetter(const Napi::CallbackInfo &info)
{
	dVector3 vec;
	getVec3(info, vec);
	dBodySetAngularVel((dBodyID)info.Data(), vec[0], vec[1], vec[2]);
}

Napi::Value createBody(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	Napi::Object obj = Napi::Object::New(env);

	dBodyID body = dBodyCreate((dWorldID)info.Data());

	obj.AddFinalizer(finalizeBody, body);
	obj.DefineProperties({
		Napi::PropertyDescriptor::Accessor<PositionGetter, PositionSetter>("position", napi_enumerable, body),
		Napi::PropertyDescriptor::Accessor<RotationGetter, RotationSetter>("rotation", napi_default, body),
		Napi::PropertyDescriptor::Accessor<QuaternionGetter, QuaternionSetter>("quaternion", napi_enumerable, body),
		Napi::PropertyDescriptor::Accessor<LinearVelGetter, LinearVelSetter>("linearVel", napi_enumerable, body),
		Napi::PropertyDescriptor::Accessor<AngularVelGetter, AngularVelSetter>("angularVel", napi_enumerable, body)
	});

	// obj.Set("step", Napi::Function::New(env, stepMethod, "WorldStep", world));
	//  this.step = function(stepsize) { dWorldStep(pointer,stepsize); return this; }
	//     this.quickStep = function(stepsize) { dWorldQuickStep(pointer,stepsize); return this; }
	//     this.setQuickStepNumIterations = function(num) { dWorldSetQuickStepNumIterations(pointer,num); return this; }

	//     this.createBody = function() { return new Body(dBodyCreate(pointer));}

	return obj;
}