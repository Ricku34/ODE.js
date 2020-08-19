#include <napi.h>


#include <ode/ode.h>

void getVec3(const Napi::CallbackInfo& info, dVector3 vec);
void getMat3(const Napi::CallbackInfo& info, dMatrix3 mat);
Napi::Value toJsVec3(Napi::Env env,const dReal *pos);
Napi::Value toJsMat3(Napi::Env env,const dReal *pos);

Napi::Value createWorld(const Napi::CallbackInfo& info);
Napi::Value createBody(const Napi::CallbackInfo &info);