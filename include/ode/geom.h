/*************************************************************************
 *                                                                       *
 * Open Dynamics Engine, Copyright (C) 2001 Russell L. Smith.            *
 *   Email: russ@q12.org   Web: www.q12.org                              *
 *                                                                       *
 * This library is free software; you can redistribute it and/or         *
 * modify it under the terms of the GNU Lesser General Public            *
 * License as published by the Free Software Foundation; either          *
 * version 2.1 of the License, or (at your option) any later version.    *
 *                                                                       *
 * This library is distributed in the hope that it will be useful,       *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU      *
 * Lesser General Public License for more details.                       *
 *                                                                       *
 * You should have received a copy of the GNU Lesser General Public      *
 * License along with this library (see the file LICENSE.TXT); if not,   *
 * write to the Free Software Foundation, Inc., 59 Temple Place,         *
 * Suite 330, Boston, MA 02111-1307 USA.                                 *
 *                                                                       *
 *************************************************************************/

#ifndef _ODE_GEOM_H_
#define _ODE_GEOM_H_

#include <ode/common.h>
#include <ode/space.h>
#include <ode/contact.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ************************************************************************ */
/* utility functions */

int dBoxTouchesBox (const dVector3 _p1, const dMatrix3 R1,
		    const dVector3 side1, const dVector3 _p2,
		    const dMatrix3 R2, const dVector3 side2);

void dInfiniteAABB (dGeomID geom, dReal aabb[6]);

/* ************************************************************************ */
/* standard classes */

/* class numbers */
extern int dSphereClass;
extern int dBoxClass;
extern int dCCylinderClass;
extern int dPlaneClass;
extern int dGeomGroupClass;
extern int dGeomTransformClass;

/* constructors */
dGeomID dCreateSphere (dSpaceID space, dReal radius);
dGeomID dCreateBox (dSpaceID space, dReal lx, dReal ly, dReal lz);
dGeomID dCreatePlane (dSpaceID space, dReal a, dReal b, dReal c, dReal d);
dGeomID dCreateCCylinder (dSpaceID space, dReal radius, dReal length);
dGeomID dCreateGeomGroup (dSpaceID space);

/* set geometry parameters */
void dGeomSphereSetRadius (dGeomID sphere, dReal radius);
void dGeomBoxSetLengths (dGeomID box, dReal lx, dReal ly, dReal lz);
void dGeomPlaneSetParams (dGeomID plane, dReal a, dReal b, dReal c, dReal d);
void dGeomCCylinderSetParams (dGeomID ccylinder, dReal radius, dReal length);

/* get geometry parameters */
int   dGeomGetClass (dGeomID);
dReal dGeomSphereGetRadius (dGeomID sphere);
void  dGeomBoxGetLengths (dGeomID box, dVector3 result);
void  dGeomPlaneGetParams (dGeomID plane, dVector4 result);
void  dGeomCCylinderGetParams (dGeomID ccylinder,
			       dReal *radius, dReal *length);

/* general functions */
void dGeomSetData (dGeomID, void *);
void *dGeomGetData (dGeomID);
void dGeomSetBody (dGeomID, dBodyID);
dBodyID dGeomGetBody (dGeomID);
void dGeomSetPosition (dGeomID, dReal x, dReal y, dReal z);
void dGeomSetRotation (dGeomID, const dMatrix3 R);
const dReal * dGeomGetPosition (dGeomID);
const dReal * dGeomGetRotation (dGeomID);
void dGeomDestroy (dGeomID);
void dGeomGetAABB (dGeomID, dReal aabb[6]);
dReal *dGeomGetSpaceAABB (dGeomID);

/* ************************************************************************ */
/* geometry group functions */

void dGeomGroupAdd (dGeomID group, dGeomID x);
void dGeomGroupRemove (dGeomID group, dGeomID x);
int dGeomGroupGetNumGeoms (dGeomID group);
dGeomID dGeomGroupGetGeom (dGeomID group, int i);

/* ************************************************************************ */
/* transformed geometry functions */

dGeomID dCreateGeomTransform (dSpaceID space);
void dGeomTransformSetGeom (dGeomID g, dGeomID obj);
dGeomID dGeomTransformGetGeom (dGeomID g);
void dGeomTransformSetCleanup (dGeomID g, int mode);
int dGeomTransformGetCleanup (dGeomID g);

/* ************************************************************************ */
/* general collision */

int dCollide (dGeomID o1, dGeomID o2, int flags, dContactGeom *contact,
	      int skip);

/* ************************************************************************ */
/* custom classes */

typedef void dGetAABBFn (dGeomID, dReal aabb[6]);
typedef int dColliderFn (dGeomID o1, dGeomID o2,
			 int flags, dContactGeom *contact, int skip);
typedef dColliderFn * dGetColliderFnFn (int num);
typedef void dGeomDtorFn (dGeomID o);
typedef int dAABBTestFn (dGeomID o1, dGeomID o2, dReal aabb[6]);

typedef struct dGeomClass {
  int bytes;
  dGetColliderFnFn *collider;
  dGetAABBFn *aabb;
  dAABBTestFn *aabb_test;
  dGeomDtorFn *dtor;
} dGeomClass;

int dCreateGeomClass (const dGeomClass *classptr);
void * dGeomGetClassData (dGeomID);
dGeomID dCreateGeom (int classnum);

/* ************************************************************************ */

#ifdef __cplusplus
}
#endif

#endif
