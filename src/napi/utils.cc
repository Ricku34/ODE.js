#include "ode-napi.h"
#include <ode/ode.h>


void getVec3(const Napi::CallbackInfo& info, dVector3 vec)
{
    if(info.Length()<1 || !info[0].IsArray() || info[0].As<Napi::Array>().Length()<3) {
        Napi::Error::New(info.Env(), "Vec3 parameter is missing!").ThrowAsJavaScriptException();
        return;
    }
    Napi::Array array = info[0].As<Napi::Array>();
    for(uint32_t i=0;i<3;i++) {
        Napi::Value val = array[i];
        vec[i] = val.As<Napi::Number>().FloatValue();
    }
}

void getMat3(const Napi::CallbackInfo& info, dMatrix3 mat)
{
    if(info.Length()<1 || !info[0].IsArray() || info[0].As<Napi::Array>().Length()<9) {
        Napi::Error::New(info.Env(), "Vec3 parameter is missing!").ThrowAsJavaScriptException();
        return;
    }
    Napi::Array array = info[0].As<Napi::Array>();
    for(uint32_t i=0;i<12;i++) {
        if(i && (i%3==0)) {
            mat[i] = 0.f;
        } else {
            Napi::Value val = array[i];
            mat[i] = val.As<Napi::Number>().FloatValue();
        }
    }
}