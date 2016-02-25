///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *	Contains FPU related code.
 *	\file		IceFPU.h
 *	\author		Pierre Terdiman
 *	\date		April, 4, 2000
 */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Include Guard
#ifndef __ICEFPU_H__
#define __ICEFPU_H__

	#define	SIGN_BITMASK			0x80000000

	//! Integer representation of a floating-point value.
	#define IR(x)					((udword&)(x))

	//! Absolute integer representation of a floating-point value
	#define AIR(x)					(IR(x)&0x7fffffff)

	//! Floating-point representation of an integer value.
	#define FR(x)					((float&)(x))

	//! Integer-based comparison of a floating point value.
	//! Don't use it blindly, it can be faster or slower than the FPU comparison, depends on the context.
	#define IS_NEGATIVE_FLOAT(x)	(IR(x)&0x80000000)

	//! Fast fabs for floating-point values. It just clears the sign bit.
	//! Don't use it blindy, it can be faster or slower than the FPU comparison, depends on the context.
	__forceinline float FastFabs(float x)
	{
		udword FloatBits = IR(x)&0x7fffffff;
		return FR(FloatBits);
	}

	//! Fast square root for floating-point values.
	__forceinline float FastSqrt(float square)
	{
			float retval;

			return fsqrt(retval);
	}

	//! Saturates positive to zero.
	__forceinline float fsat(float f)
	{
		udword y = (udword&)f & ~((sdword&)f >>31);
		return (float&)y;
	}

	//! Computes 1.0f / sqrtf(x).
/*	__inline float frsqrt(float f)
	{
		float x = f * 0.5f;
		udword y = 0x5f3759df - ((udword&)f >> 1);
		// Iteration...
		(float&)y  = (float&)y * ( 1.5f - ( x * (float&)y * (float&)y ) );
		// Result
		return (float&)y;
	}
*/
	//! Computes 1.0f / sqrtf(x). Comes from NVIDIA.
	__forceinline float InvSqrt(const float& x)
	{
		udword tmp = (udword(IEEE_1_0 << 1) + IEEE_1_0 - *(udword*)&x) >> 1;
		float y = *(float*)&tmp;
		return y * (1.47f - 0.47f * x * y * y);
	}

	//! TO BE DOCUMENTED
/*	__forceinline float fsqrt(float f)
	{
		udword y = ( ( (sdword&)f - 0x3f800000 ) >> 1 ) + 0x3f800000;
		// Iteration...?
		// (float&)y = (3.0f - ((float&)y * (float&)y) / f) * (float&)y * 0.5f;
		// Result
		return (float&)y;
	}
	*/

	//! Returns the float ranged espilon value.
	__forceinline float fepsilon(float f)
	{
		udword b = (udword&)f & 0xff800000;
		udword a = b | 0x00000001;
		(float&)a -= (float&)b;
		// Result
		return (float&)a;
	}

	//! Is the float valid ?
	__forceinline bool IsNAN(float value)	{ return ((*(udword*)&value)&0x7f800000)==0x7f800000; }
	#define	NaN(value) (!((value>=0) || (value<0)))

/*
	//! FPU precision setting function.
	__forceinline void SetFPU()
	{
		// This function evaluates whether the floating-point
		// control word is set to single precision/round to nearest/
		// exceptions disabled. If these conditions don't hold, the
		// function changes the control word to set them and returns
		// TRUE, putting the old control word value in the passback
		// location pointed to by pwOldCW.
		{
			uword wTemp, wSave;

			__asm fstcw wSave
			if (wSave & 0x300 ||            // Not single mode
				0x3f != (wSave & 0x3f) ||   // Exceptions enabled
				wSave & 0xC00)              // Not round to nearest mode
			{
				__asm
				{
					mov ax, wSave
					and ax, not 300h    ;; single mode
					or  ax, 3fh         ;; disable all exceptions
					and ax, not 0xC00   ;; round to nearest mode
					mov wTemp, ax
					fldcw   wTemp
				}
			}
		}
	}
*/
	//! This function computes the slowest possible floating-point value (you can also directly use FLT_EPSILON)
	__forceinline float ComputeFloatEpsilon()
	{
		float f = 1.0f;
		((udword&)f)^=1;
		return f - 1.0f;	// You can check it's the same as FLT_EPSILON
	}

	__forceinline bool IsFloatZero(float x, float epsilon=1e-6f)
	{
		return x*x < epsilon;
	}

	#define FCOMI_ST0	_asm	_emit	0xdb	_asm	_emit	0xf0
	#define FCOMIP_ST0	_asm	_emit	0xdf	_asm	_emit	0xf0
	#define FCMOVB_ST0	_asm	_emit	0xda	_asm	_emit	0xc0
	#define FCMOVNB_ST0	_asm	_emit	0xdb	_asm	_emit	0xc0

	#define FCOMI_ST1	_asm	_emit	0xdb	_asm	_emit	0xf1
	#define FCOMIP_ST1	_asm	_emit	0xdf	_asm	_emit	0xf1
	#define FCMOVB_ST1	_asm	_emit	0xda	_asm	_emit	0xc1
	#define FCMOVNB_ST1	_asm	_emit	0xdb	_asm	_emit	0xc1

	#define FCOMI_ST2	_asm	_emit	0xdb	_asm	_emit	0xf2
	#define FCOMIP_ST2	_asm	_emit	0xdf	_asm	_emit	0xf2
	#define FCMOVB_ST2	_asm	_emit	0xda	_asm	_emit	0xc2
	#define FCMOVNB_ST2	_asm	_emit	0xdb	_asm	_emit	0xc2

	//! A global function to find MAX(a,b,c) using FCOMI/FCMOV
	__forceinline float FCMax3(float a, float b, float c)
	{
		float Res;
		/*_asm	fld		[a]
		_asm	fld		[b]
		_asm	fld		[c]
		FCOMI_ST1
		FCMOVB_ST1
		FCOMI_ST2
		FCMOVB_ST2
		_asm	fstp	[Res]
		_asm	fcompp*/
		Res = a > b ? a : b;
		return Res > c ? Res : c;
	}

	//! A global function to find MIN(a,b,c) using FCOMI/FCMOV
	__forceinline float FCMin3(float a, float b, float c)
	{
		float Res;
/*		_asm	fld		[a]
		_asm	fld		[b]
		_asm	fld		[c]
		FCOMI_ST1
		FCMOVNB_ST1
		FCOMI_ST2
		FCMOVNB_ST2
		_asm	fstp	[Res]
		_asm	fcompp*/
		Res = a < b ? a : b;
		return Res < c ? Res : c;
	}

	__forceinline int ConvertToSortable(float f)
	{
		int& Fi = (int&)f;
		int Fmask = (Fi>>31);
		Fi ^= Fmask;
		Fmask &= ~(1<<31);
		Fi -= Fmask;
		return Fi;
	}

	enum FPUMode
	{
		FPU_FLOOR		= 0,
		FPU_CEIL		= 1,
		FPU_BEST		= 2,
		FPU_FORCE_DWORD	= 0x7fffffff
	};

	ICECORE_API FPUMode	GetFPUMode();
	ICECORE_API void	SaveFPU();
	ICECORE_API void	RestoreFPU();
	ICECORE_API void	SetFPUFloorMode();
	ICECORE_API void	SetFPUCeilMode();
	ICECORE_API void	SetFPUBestMode();

#endif // __ICEFPU_H__
