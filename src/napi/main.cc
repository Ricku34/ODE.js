#include "ode-napi.h"



Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  //return World::Init(env, exports);
  exports.Set("World", Napi::Function::New<createWorld>(env));
  return exports;
}

NODE_API_MODULE(addon, InitAll)