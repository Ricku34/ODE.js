
#include "ode-napi.h"

Napi::Value PositionGetter(const Napi::CallbackInfo &info)
{
  const dReal *pos = dBodyGetPosition((dBodyID)info.Data());
  Napi::Array res = Napi::Array::New(info.Env(), 3);
  res[(uint32_t)0] = Napi::Number::New(info.Env(), pos[0]);
  res[(uint32_t)1] = Napi::Number::New(info.Env(), pos[1]);
  res[(uint32_t)2] = Napi::Number::New(info.Env(), pos[2]);
  return res;
}

void PositionSetter(const Napi::CallbackInfo &info)
{
  dVector3 vec;
  getVec3(info, vec);
  dBodySetPosition((dBodyID)info.Data(), vec[0], vec[1], vec[2]);
}

Napi::Value RotationGetter(const Napi::CallbackInfo &info)
{
  const dReal *pos  = dBodyGetRotation((dBodyID)info.Data());
  Napi::Array res = Napi::Array::New(info.Env(), 12);
  for(uint32_t i=0;i<12;i++) {
    res[i] = Napi::Number::New(info.Env(), pos[i]);
  }
  return res;
}

void RotationSetter(const Napi::CallbackInfo &info)
{
  dMatrix3 mat;
  getMat3(info, mat);
  dBodySetRotation((dBodyID)info.Data(), mat);
}

void finalizeBody(Napi::Env env, dBodyID body)
{
  dBodyDestroy(body);
}

Napi::Value createBody(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Object obj = Napi::Object::New(env);

  dBodyID body = dBodyCreate((dWorldID)info.Data());

  obj.AddFinalizer(finalizeBody, body);

  Napi::PropertyDescriptor pdPosition = Napi::PropertyDescriptor::Accessor<PositionGetter, PositionSetter>("position", napi_enumerable, body);
  Napi::PropertyDescriptor pdRotation = Napi::PropertyDescriptor::Accessor<RotationGetter, RotationSetter>("rotation", napi_enumerable, body);
  obj.DefineProperties({pdPosition,pdRotation});

  
  // obj.Set("step", Napi::Function::New(env, stepMethod, "WorldStep", world));
  //  this.step = function(stepsize) { dWorldStep(pointer,stepsize); return this; }
  //     this.quickStep = function(stepsize) { dWorldQuickStep(pointer,stepsize); return this; }
  //     this.setQuickStepNumIterations = function(num) { dWorldSetQuickStepNumIterations(pointer,num); return this; }

  //     this.createBody = function() { return new Body(dBodyCreate(pointer));}

  return obj;
}