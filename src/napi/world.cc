#include "ode-napi.h"
#include <ode/ode.h>

Napi::Value GravityGetter(const Napi::CallbackInfo &info)
{
  dReal vec[4];
  dWorldGetGravity((dWorldID)info.Data(), vec);
  Napi::Array res = Napi::Array::New(info.Env(), 3);
  res[(uint32_t)0] = Napi::Number::New(info.Env(), vec[0]);
  res[(uint32_t)1] = Napi::Number::New(info.Env(), vec[1]);
  res[(uint32_t)2] = Napi::Number::New(info.Env(), vec[2]);
  return res;
}

void GravitySetter(const Napi::CallbackInfo &info)
{
  Napi::Array vec = info[0].As<Napi::Array>();
  Napi::Value val = vec[(uint32_t)0];
  Napi::Number x = val.As<Napi::Number>();
  val = vec[(uint32_t)1];
  Napi::Number y = val.As<Napi::Number>();
  val = vec[(uint32_t)2];
  Napi::Number z = val.As<Napi::Number>();
  dWorldSetGravity((dWorldID)info.Data(), x.FloatValue(), y.FloatValue(), z.FloatValue());
}

Napi::Value ERPGetter(const Napi::CallbackInfo &info)
{
  return Napi::Number::New(info.Env(), dWorldGetERP((dWorldID)info.Data()));
}

void ERPSetter(const Napi::CallbackInfo &info)
{
  dWorldSetERP((dWorldID)info.Data(), info[0].As<Napi::Number>().FloatValue());
}

Napi::Value CFMGetter(const Napi::CallbackInfo &info)
{
  return Napi::Number::New(info.Env(), dWorldGetCFM((dWorldID)info.Data()));
}

void CFMSetter(const Napi::CallbackInfo &info)
{
  dWorldSetCFM((dWorldID)info.Data(), info[0].As<Napi::Number>().FloatValue());
}

Napi::Value CMCVGetter(const Napi::CallbackInfo &info)
{
  return Napi::Number::New(info.Env(), dWorldGetContactMaxCorrectingVel((dWorldID)info.Data()));
}

void CMCVSetter(const Napi::CallbackInfo &info)
{
  dWorldSetContactMaxCorrectingVel((dWorldID)info.Data(), info[0].As<Napi::Number>().FloatValue());
}

Napi::Value CSLGetter(const Napi::CallbackInfo &info)
{
  return Napi::Number::New(info.Env(), dWorldGetContactSurfaceLayer((dWorldID)info.Data()));
}

void CSLSetter(const Napi::CallbackInfo &info)
{
  dWorldSetContactSurfaceLayer((dWorldID)info.Data(), info[0].As<Napi::Number>().FloatValue());
}

void stepMethod(const Napi::CallbackInfo &info)
{
  dWorldStep((dWorldID)info.Data(), info[0].As<Napi::Number>().FloatValue());
}

Napi::Value createWorld(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Value self = info.This();
  if (info.IsConstructCall() && self.IsObject())
  {
    Napi::Object obj = self.As<Napi::Object>();
    dWorldID world = dWorldCreate();
    Napi::PropertyDescriptor pdGravity = Napi::PropertyDescriptor::Accessor<GravityGetter, GravitySetter>("gravity", napi_enumerable, world);
    Napi::PropertyDescriptor pdERP = Napi::PropertyDescriptor::Accessor<ERPGetter, ERPSetter>("ERP", napi_enumerable, world);

    Napi::PropertyDescriptor pdCFM = Napi::PropertyDescriptor::Accessor<CFMGetter, CFMSetter>("CFM", napi_enumerable, world);
    Napi::PropertyDescriptor pdCMCV = Napi::PropertyDescriptor::Accessor<CMCVGetter, CMCVSetter>("ContactMaxCorrectingVel", napi_enumerable, world);
    Napi::PropertyDescriptor pdCSL = Napi::PropertyDescriptor::Accessor<CSLGetter, CSLSetter>("ContactSurfaceLayer", napi_enumerable, world);

    obj.DefineProperties({pdGravity, pdERP, pdCFM, pdCMCV, pdCSL});
    obj.Set("step", Napi::Function::New(env, stepMethod, "WorldStep", world));
    //  this.step = function(stepsize) { dWorldStep(pointer,stepsize); return this; }
    //     this.quickStep = function(stepsize) { dWorldQuickStep(pointer,stepsize); return this; }
    //     this.setQuickStepNumIterations = function(num) { dWorldSetQuickStepNumIterations(pointer,num); return this; }

    //     this.createBody = function() { return new Body(dBodyCreate(pointer));}
  }
  return self;
}
