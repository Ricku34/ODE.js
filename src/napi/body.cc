
#include "ode-napi.h"
#include <ode/ode.h>

void finalizeBody(Napi::Env env, dBodyID body){
  dBodyDestroy(body);
}

Napi::Value createBody(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Object obj = Napi::Object::New(env);
  
  dBodyID body = dBodyCreate((dWorldID)info.Data());

  obj.AddFinalizer(finalizeBody,body);

    // Napi::PropertyDescriptor pdGravity = Napi::PropertyDescriptor::Accessor<GravityGetter, GravitySetter>("gravity", napi_enumerable, world);
    // Napi::PropertyDescriptor pdERP = Napi::PropertyDescriptor::Accessor<ERPGetter, ERPSetter>("ERP", napi_enumerable, world);

    // Napi::PropertyDescriptor pdCFM = Napi::PropertyDescriptor::Accessor<CFMGetter, CFMSetter>("CFM", napi_enumerable, world);
    // Napi::PropertyDescriptor pdCMCV = Napi::PropertyDescriptor::Accessor<CMCVGetter, CMCVSetter>("ContactMaxCorrectingVel", napi_enumerable, world);
    // Napi::PropertyDescriptor pdCSL = Napi::PropertyDescriptor::Accessor<CSLGetter, CSLSetter>("ContactSurfaceLayer", napi_enumerable, world);

    // obj.DefineProperties({pdGravity, pdERP, pdCFM, pdCMCV, pdCSL});
    // obj.Set("step", Napi::Function::New(env, stepMethod, "WorldStep", world));
    //  this.step = function(stepsize) { dWorldStep(pointer,stepsize); return this; }
    //     this.quickStep = function(stepsize) { dWorldQuickStep(pointer,stepsize); return this; }
    //     this.setQuickStepNumIterations = function(num) { dWorldSetQuickStepNumIterations(pointer,num); return this; }

    //     this.createBody = function() { return new Body(dBodyCreate(pointer));}

  return obj;
}