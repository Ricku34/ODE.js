#include "ode-napi.h"


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
        if(((i+1)%4)) {
            Napi::Value val = array[i];
            mat[i] = val.As<Napi::Number>().FloatValue();
        } else {
            mat[i] = 0.f;
        }
    }
}

Napi::Value toJsVec3(Napi::Env env,const dReal *vec) {
    Napi::Array res = Napi::Array::New(env, 3);
    res[(uint32_t)0] = Napi::Number::New(env, vec[0]);
    res[(uint32_t)1] = Napi::Number::New(env, vec[1]);
    res[(uint32_t)2] = Napi::Number::New(env, vec[2]);
    return res;
}

Napi::Value toJsMat3(Napi::Env env,const dReal *mat) {
    Napi::Array res = Napi::Array::New(env, 9);
    uint32_t j=0;
    for(uint32_t i=0;i<12;i++) {
        if((i+1)%4) {
            res[j++] = Napi::Number::New(env, mat[i]);
        }
    }
    return res;

}