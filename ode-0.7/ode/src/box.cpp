/*************************************************************************
 *                                                                       *
 * Open Dynamics Engine, Copyright (C) 2001-2003 Russell L. Smith.       *
 * All rights reserved.  Email: russ@q12.org   Web: www.q12.org          *
 *                                                                       *
 * This library is free software; you can redistribute it and/or         *
 * modify it under the terms of EITHER:                                  *
 *   (1) The GNU Lesser General Public License as published by the Free  *
 *       Software Foundation; either version 2.1 of the License, or (at  *
 *       your option) any later version. The text of the GNU Lesser      *
 *       General Public License is included with this library in the     *
 *       file LICENSE.TXT.                                               *
 *   (2) The BSD-style license that is included with this library in     *
 *       the file LICENSE-BSD.TXT.                                       *
 *                                                                       *
 * This library is distributed in the hope that it will be useful,       *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the files    *
 * LICENSE.TXT and LICENSE-BSD.TXT for more details.                     *
 *                                                                       *
 *************************************************************************/

/*

standard ODE geometry primitives: public API and pairwise collision functions.

the rule is that only the low level primitive collision functions should set
dContactGeom::g1 and dContactGeom::g2.

*/

#include <ode/common.h>
#include <ode/collision.h>
#include <ode/matrix.h>
#include <ode/rotation.h>
#include <ode/odemath.h>
#include "collision_kernel.h"
#include "collision_std.h"
#include "collision_util.h"

#ifdef _MSC_VER
#pragma warning(disable:4291)  // for VC++, no complaints about "no matching operator delete found"
#endif

//****************************************************************************
// box public API

dxBox::dxBox (dSpaceID space, dReal lx, dReal ly, dReal lz) : dxGeom (space,1)
{
  dAASSERT (lx >= 0 && ly >= 0 && lz >= 0);
  type = dBoxClass;
  side[0] = lx;
  side[1] = ly;
  side[2] = lz;
}


void dxBox::computeAABB()
{
  const dMatrix3& R = final_posr->R;
  const dVector3& pos = final_posr->pos;
  
  dReal xrange = REAL(0.5) * (dFabs (R[0] * side[0]) +
    dFabs (R[1] * side[1]) + dFabs (R[2] * side[2]));
  dReal yrange = REAL(0.5) * (dFabs (R[4] * side[0]) +
    dFabs (R[5] * side[1]) + dFabs (R[6] * side[2]));
  dReal zrange = REAL(0.5) * (dFabs (R[8] * side[0]) +
    dFabs (R[9] * side[1]) + dFabs (R[10] * side[2]));
  aabb[0] = pos[0] - xrange;
  aabb[1] = pos[0] + xrange;
  aabb[2] = pos[1] - yrange;
  aabb[3] = pos[1] + yrange;
  aabb[4] = pos[2] - zrange;
  aabb[5] = pos[2] + zrange;
}


dGeomID dCreateBox (dSpaceID space, dReal lx, dReal ly, dReal lz)
{
  return new dxBox (space,lx,ly,lz);
}


void dGeomBoxSetLengths (dGeomID g, dReal lx, dReal ly, dReal lz)
{
  dUASSERT (g && g->type == dBoxClass,"argument not a box");
  dAASSERT (lx > 0 && ly > 0 && lz > 0);
  dxBox *b = (dxBox*) g;
  b->side[0] = lx;
  b->side[1] = ly;
  b->side[2] = lz;
  dGeomMoved (g);
}


void dGeomBoxGetLengths (dGeomID g, dVector3 result)
{
  dUASSERT (g && g->type == dBoxClass,"argument not a box");
  dxBox *b = (dxBox*) g;
  result[0] = b->side[0];
  result[1] = b->side[1];
  result[2] = b->side[2];
}


dReal dGeomBoxPointDepth (dGeomID g, dReal x, dReal y, dReal z)
{
  dUASSERT (g && g->type == dBoxClass,"argument not a box");
  g->recomputePosr();
  dxBox *b = (dxBox*) g;

  // Set p = (x,y,z) relative to box center
  //
  // This will be (0,0,0) if the point is at (side[0]/2,side[1]/2,side[2]/2)

  dVector3 p,q;

  p[0] = x - b->final_posr->pos[0];
  p[1] = y - b->final_posr->pos[1];
  p[2] = z - b->final_posr->pos[2];

  // Rotate p into box's coordinate frame, so we can
  // treat the OBB as an AABB

  dMULTIPLY1_331 (q,b->final_posr->R,p);

  // Record distance from point to each successive box side, and see
  // if the point is inside all six sides

  dReal dist[6];
  int   i;

  bool inside = true;

  for (i=0; i < 3; i++) {
    dReal side = b->side[i] * REAL(0.5);

    dist[i  ] = side - q[i];
    dist[i+3] = side + q[i];

    if ((dist[i] < 0) || (dist[i+3] < 0)) {
      inside = false;
    }
  }

  // If point is inside the box, the depth is the smallest positive distance
  // to any side

  if (inside) {
    dReal smallest_dist = (dReal) (unsigned) -1;

    for (i=0; i < 6; i++) {
      if (dist[i] < smallest_dist) smallest_dist = dist[i];
    }

    return smallest_dist;
  }

  // Otherwise, if point is outside the box, the depth is the largest
  // distance to any side.  This is an approximation to the 'proper'
  // solution (the proper solution may be larger in some cases).

  dReal largest_dist = 0;

  for (i=0; i < 6; i++) {
    if (dist[i] > largest_dist) largest_dist = dist[i];
  }

  return -largest_dist;
}

//****************************************************************************
// box-box collision utility


// find all the intersection points between the 2D rectangle with vertices
// at (+/-h[0],+/-h[1]) and the 2D quadrilateral with vertices (p[0],p[1]),
// (p[2],p[3]),(p[4],p[5]),(p[6],p[7]).
//
// the intersection points are returned as x,y pairs in the 'ret' array.
// the number of intersection points is returned by the function (this will
// be in the range 0 to 8).

static int intersectRectQuad (dReal h[2], dReal p[8], dReal ret[16])
{
  // q (and r) contain nq (and nr) coordinate points for the current (and
  // chopped) polygons
  int nq=4,nr;
  dReal buffer[16];
  dReal *q = p;
  dReal *r = ret;
  for (int dir=0; dir <= 1; dir++) {
    // direction notation: xy[0] = x axis, xy[1] = y axis
    for (int sign=-1; sign <= 1; sign += 2) {
      // chop q along the line xy[dir] = sign*h[dir]
      dReal *pq = q;
      dReal *pr = r;
      nr = 0;
      for (int i=nq; i > 0; i--) {
	// go through all points in q and all lines between adjacent points
	if (sign*pq[dir] < h[dir]) {
	  // this point is inside the chopping line
	  pr[0] = pq[0];
	  pr[1] = pq[1];
	  pr += 2;
	  nr++;
	  if (nr & 8) {
	    q = r;
	    goto done;
	  }
	}
	dReal *nextq = (i > 1) ? pq+2 : q;
	if ((sign*pq[dir] < h[dir]) ^ (sign*nextq[dir] < h[dir])) {
	  // this line crosses the chopping line
	  pr[1-dir] = pq[1-dir] + (nextq[1-dir]-pq[1-dir]) /
	    (nextq[dir]-pq[dir]) * (sign*h[dir]-pq[dir]);
	  pr[dir] = sign*h[dir];
	  pr += 2;
	  nr++;
	  if (nr & 8) {
	    q = r;
	    goto done;
	  }
	}
	pq += 2;
      }
      q = r;
      r = (q==ret) ? buffer : ret;
      nq = nr;
    }
  }
 done:
  if (q != ret) memcpy (ret,q,nr*2*sizeof(dReal));
  return nr;
}


// given n points in the plane (array p, of size 2*n), generate m points that
// best represent the whole set. the definition of 'best' here is not
// predetermined - the idea is to select points that give good box-box
// collision detection behavior. the chosen point indexes are returned in the
// array iret (of size m). 'i0' is always the first entry in the array.
// n must be in the range [1..8]. m must be in the range [1..n]. i0 must be
// in the range [0..n-1].

void cullPoints (int n, dReal p[], int m, int i0, int iret[])
{
  // compute the centroid of the polygon in cx,cy
  int i,j;
  dReal a,cx,cy,q;
  if (n==1) {
    cx = p[0];
    cy = p[1];
  }
  else if (n==2) {
    cx = REAL(0.5)*(p[0] + p[2]);
    cy = REAL(0.5)*(p[1] + p[3]);
  }
  else {
    a = 0;
    cx = 0;
    cy = 0;
    for (i=0; i<(n-1); i++) {
      q = p[i*2]*p[i*2+3] - p[i*2+2]*p[i*2+1];
      a += q;
      cx += q*(p[i*2]+p[i*2+2]);
      cy += q*(p[i*2+1]+p[i*2+3]);
    }
    q = p[n*2-2]*p[1] - p[0]*p[n*2-1];
    a = dRecip(REAL(3.0)*(a+q));
    cx = a*(cx + q*(p[n*2-2]+p[0]));
    cy = a*(cy + q*(p[n*2-1]+p[1]));
  }

  // compute the angle of each point w.r.t. the centroid
  dReal A[8];
  for (i=0; i<n; i++) A[i] = dAtan2(p[i*2+1]-cy,p[i*2]-cx);

  // search for points that have angles closest to A[i0] + i*(2*pi/m).
  int avail[8];
  for (i=0; i<n; i++) avail[i] = 1;
  avail[i0] = 0;
  iret[0] = i0;
  iret++;
  for (j=1; j<m; j++) {
    a = dReal(j)*(2*M_PI/m) + A[i0];
    if (a > M_PI) a -= 2*M_PI;
    dReal maxdiff=1e9,diff;
#ifndef dNODEBUG
    *iret = i0;			// iret is not allowed to keep this value
#endif
    for (i=0; i<n; i++) {
      if (avail[i]) {
	diff = dFabs (A[i]-a);
	if (diff > M_PI) diff = 2*M_PI - diff;
	if (diff < maxdiff) {
	  maxdiff = diff;
	  *iret = i;
	}
      }
    }
#ifndef dNODEBUG
    dIASSERT (*iret != i0);	// ensure iret got set
#endif
    avail[*iret] = 0;
    iret++;
  }
}


// given two boxes (p1,R1,side1) and (p2,R2,side2), collide them together and
// generate contact points. this returns 0 if there is no contact otherwise
// it returns the number of contacts generated.
// `normal' returns the contact normal.
// `depth' returns the maximum penetration depth along that normal.
// `return_code' returns a number indicating the type of contact that was
// detected:
//        1,2,3 = box 2 intersects with a face of box 1
//        4,5,6 = box 1 intersects with a face of box 2
//        7..15 = edge-edge contact
// `maxc' is the maximum number of contacts allowed to be generated, i.e.
// the size of the `contact' array.
// `contact' and `skip' are the contact array information provided to the
// collision functions. this function only fills in the position and depth
// fields.

int dBoxBox (const dVector3 p1, const dMatrix3 R1,
	     const dVector3 side1, const dVector3 p2,
	     const dMatrix3 R2, const dVector3 side2,
	     dVector3 normal, dReal *depth, int *return_code,
	     int maxc, dContactGeom *contact, int skip)
{
  const dReal fudge_factor = REAL(1.05);
  dVector3 p,pp,normalC;
  const dReal *normalR = 0;
  dReal A[3],B[3],R11,R12,R13,R21,R22,R23,R31,R32,R33,
    Q11,Q12,Q13,Q21,Q22,Q23,Q31,Q32,Q33,s,s2,l;
  int i,j,invert_normal,code;

  // get vector from centers of box 1 to box 2, relative to box 1
  p[0] = p2[0] - p1[0];
  p[1] = p2[1] - p1[1];
  p[2] = p2[2] - p1[2];
  dMULTIPLY1_331 (pp,R1,p);		// get pp = p relative to body 1

  // get side lengths / 2
  A[0] = side1[0]*REAL(0.5);
  A[1] = side1[1]*REAL(0.5);
  A[2] = side1[2]*REAL(0.5);
  B[0] = side2[0]*REAL(0.5);
  B[1] = side2[1]*REAL(0.5);
  B[2] = side2[2]*REAL(0.5);

  // Rij is R1'*R2, i.e. the relative rotation between R1 and R2
  R11 = dDOT44(R1+0,R2+0); R12 = dDOT44(R1+0,R2+1); R13 = dDOT44(R1+0,R2+2);
  R21 = dDOT44(R1+1,R2+0); R22 = dDOT44(R1+1,R2+1); R23 = dDOT44(R1+1,R2+2);
  R31 = dDOT44(R1+2,R2+0); R32 = dDOT44(R1+2,R2+1); R33 = dDOT44(R1+2,R2+2);

  Q11 = dFabs(R11); Q12 = dFabs(R12); Q13 = dFabs(R13);
  Q21 = dFabs(R21); Q22 = dFabs(R22); Q23 = dFabs(R23);
  Q31 = dFabs(R31); Q32 = dFabs(R32); Q33 = dFabs(R33);

  // for all 15 possible separating axes:
  //   * see if the axis separates the boxes. if so, return 0.
  //   * find the depth of the penetration along the separating axis (s2)
  //   * if this is the largest depth so far, record it.
  // the normal vector will be set to the separating axis with the smallest
  // depth. note: normalR is set to point to a column of R1 or R2 if that is
  // the smallest depth normal so far. otherwise normalR is 0 and normalC is
  // set to a vector relative to body 1. invert_normal is 1 if the sign of
  // the normal should be flipped.

#define TST(expr1,expr2,norm,cc) \
  s2 = dFabs(expr1) - (expr2); \
  if (s2 > 0) return 0; \
  if (s2 > s) { \
    s = s2; \
    normalR = norm; \
    invert_normal = ((expr1) < 0); \
    code = (cc); \
  }

  s = -dInfinity;
  invert_normal = 0;
  code = 0;

  // separating axis = u1,u2,u3
  TST (pp[0],(A[0] + B[0]*Q11 + B[1]*Q12 + B[2]*Q13),R1+0,1);
  TST (pp[1],(A[1] + B[0]*Q21 + B[1]*Q22 + B[2]*Q23),R1+1,2);
  TST (pp[2],(A[2] + B[0]*Q31 + B[1]*Q32 + B[2]*Q33),R1+2,3);

  // separating axis = v1,v2,v3
  TST (dDOT41(R2+0,p),(A[0]*Q11 + A[1]*Q21 + A[2]*Q31 + B[0]),R2+0,4);
  TST (dDOT41(R2+1,p),(A[0]*Q12 + A[1]*Q22 + A[2]*Q32 + B[1]),R2+1,5);
  TST (dDOT41(R2+2,p),(A[0]*Q13 + A[1]*Q23 + A[2]*Q33 + B[2]),R2+2,6);

  // note: cross product axes need to be scaled when s is computed.
  // normal (n1,n2,n3) is relative to box 1.
#undef TST
#define TST(expr1,expr2,n1,n2,n3,cc) \
  s2 = dFabs(expr1) - (expr2); \
  if (s2 > 0) return 0; \
  l = dSqrt ((n1)*(n1) + (n2)*(n2) + (n3)*(n3)); \
  if (l > 0) { \
    s2 /= l; \
    if (s2*fudge_factor > s) { \
      s = s2; \
      normalR = 0; \
      normalC[0] = (n1)/l; normalC[1] = (n2)/l; normalC[2] = (n3)/l; \
      invert_normal = ((expr1) < 0); \
      code = (cc); \
    } \
  }

  // separating axis = u1 x (v1,v2,v3)
  TST(pp[2]*R21-pp[1]*R31,(A[1]*Q31+A[2]*Q21+B[1]*Q13+B[2]*Q12),0,-R31,R21,7);
  TST(pp[2]*R22-pp[1]*R32,(A[1]*Q32+A[2]*Q22+B[0]*Q13+B[2]*Q11),0,-R32,R22,8);
  TST(pp[2]*R23-pp[1]*R33,(A[1]*Q33+A[2]*Q23+B[0]*Q12+B[1]*Q11),0,-R33,R23,9);

  // separating axis = u2 x (v1,v2,v3)
  TST(pp[0]*R31-pp[2]*R11,(A[0]*Q31+A[2]*Q11+B[1]*Q23+B[2]*Q22),R31,0,-R11,10);
  TST(pp[0]*R32-pp[2]*R12,(A[0]*Q32+A[2]*Q12+B[0]*Q23+B[2]*Q21),R32,0,-R12,11);
  TST(pp[0]*R33-pp[2]*R13,(A[0]*Q33+A[2]*Q13+B[0]*Q22+B[1]*Q21),R33,0,-R13,12);

  // separating axis = u3 x (v1,v2,v3)
  TST(pp[1]*R11-pp[0]*R21,(A[0]*Q21+A[1]*Q11+B[1]*Q33+B[2]*Q32),-R21,R11,0,13);
  TST(pp[1]*R12-pp[0]*R22,(A[0]*Q22+A[1]*Q12+B[0]*Q33+B[2]*Q31),-R22,R12,0,14);
  TST(pp[1]*R13-pp[0]*R23,(A[0]*Q23+A[1]*Q13+B[0]*Q32+B[1]*Q31),-R23,R13,0,15);

#undef TST

  if (!code) return 0;

  // if we get to this point, the boxes interpenetrate. compute the normal
  // in global coordinates.
  if (normalR) {
    normal[0] = normalR[0];
    normal[1] = normalR[4];
    normal[2] = normalR[8];
  }
  else {
    dMULTIPLY0_331 (normal,R1,normalC);
  }
  if (invert_normal) {
    normal[0] = -normal[0];
    normal[1] = -normal[1];
    normal[2] = -normal[2];
  }
  *depth = -s;

  // compute contact point(s)

  if (code > 6) {
    // an edge from box 1 touches an edge from box 2.
    // find a point pa on the intersecting edge of box 1
    dVector3 pa;
    dReal sign;
    for (i=0; i<3; i++) pa[i] = p1[i];
    for (j=0; j<3; j++) {
      sign = (dDOT14(normal,R1+j) > 0) ? REAL(1.0) : REAL(-1.0);
      for (i=0; i<3; i++) pa[i] += sign * A[j] * R1[i*4+j];
    }

    // find a point pb on the intersecting edge of box 2
    dVector3 pb;
    for (i=0; i<3; i++) pb[i] = p2[i];
    for (j=0; j<3; j++) {
      sign = (dDOT14(normal,R2+j) > 0) ? REAL(-1.0) : REAL(1.0);
      for (i=0; i<3; i++) pb[i] += sign * B[j] * R2[i*4+j];
    }

    dReal alpha,beta;
    dVector3 ua,ub;
    for (i=0; i<3; i++) ua[i] = R1[((code)-7)/3 + i*4];
    for (i=0; i<3; i++) ub[i] = R2[((code)-7)%3 + i*4];

    dLineClosestApproach (pa,ua,pb,ub,&alpha,&beta);
    for (i=0; i<3; i++) pa[i] += ua[i]*alpha;
    for (i=0; i<3; i++) pb[i] += ub[i]*beta;

    for (i=0; i<3; i++) contact[0].pos[i] = REAL(0.5)*(pa[i]+pb[i]);
    contact[0].depth = *depth;
    *return_code = code;
    return 1;
  }

  // okay, we have a face-something intersection (because the separating
  // axis is perpendicular to a face). define face 'a' to be the reference
  // face (i.e. the normal vector is perpendicular to this) and face 'b' to be
  // the incident face (the closest face of the other box).

  const dReal *Ra,*Rb,*pa,*pb,*Sa,*Sb;
  if (code <= 3) {
    Ra = R1;
    Rb = R2;
    pa = p1;
    pb = p2;
    Sa = A;
    Sb = B;
  }
  else {
    Ra = R2;
    Rb = R1;
    pa = p2;
    pb = p1;
    Sa = B;
    Sb = A;
  }

  // nr = normal vector of reference face dotted with axes of incident box.
  // anr = absolute values of nr.
  dVector3 normal2,nr,anr;
  if (code <= 3) {
    normal2[0] = normal[0];
    normal2[1] = normal[1];
    normal2[2] = normal[2];
  }
  else {
    normal2[0] = -normal[0];
    normal2[1] = -normal[1];
    normal2[2] = -normal[2];
  }
  dMULTIPLY1_331 (nr,Rb,normal2);
  anr[0] = dFabs (nr[0]);
  anr[1] = dFabs (nr[1]);
  anr[2] = dFabs (nr[2]);

  // find the largest compontent of anr: this corresponds to the normal
  // for the indident face. the other axis numbers of the indicent face
  // are stored in a1,a2.
  int lanr,a1,a2;
  if (anr[1] > anr[0]) {
    if (anr[1] > anr[2]) {
      a1 = 0;
      lanr = 1;
      a2 = 2;
    }
    else {
      a1 = 0;
      a2 = 1;
      lanr = 2;
    }
  }
  else {
    if (anr[0] > anr[2]) {
      lanr = 0;
      a1 = 1;
      a2 = 2;
    }
    else {
      a1 = 0;
      a2 = 1;
      lanr = 2;
    }
  }

  // compute center point of incident face, in reference-face coordinates
  dVector3 center;
  if (nr[lanr] < 0) {
    for (i=0; i<3; i++) center[i] = pb[i] - pa[i] + Sb[lanr] * Rb[i*4+lanr];
  }
  else {
    for (i=0; i<3; i++) center[i] = pb[i] - pa[i] - Sb[lanr] * Rb[i*4+lanr];
  }

  // find the normal and non-normal axis numbers of the reference box
  int codeN,code1,code2;
  if (code <= 3) codeN = code-1; else codeN = code-4;
  if (codeN==0) {
    code1 = 1;
    code2 = 2;
  }
  else if (codeN==1) {
    code1 = 0;
    code2 = 2;
  }
  else {
    code1 = 0;
    code2 = 1;
  }

  // find the four corners of the incident face, in reference-face coordinates
  dReal quad[8];	// 2D coordinate of incident face (x,y pairs)
  dReal c1,c2,m11,m12,m21,m22;
  c1 = dDOT14 (center,Ra+code1);
  c2 = dDOT14 (center,Ra+code2);
  // optimize this? - we have already computed this data above, but it is not
  // stored in an easy-to-index format. for now it's quicker just to recompute
  // the four dot products.
  m11 = dDOT44 (Ra+code1,Rb+a1);
  m12 = dDOT44 (Ra+code1,Rb+a2);
  m21 = dDOT44 (Ra+code2,Rb+a1);
  m22 = dDOT44 (Ra+code2,Rb+a2);
  {
    dReal k1 = m11*Sb[a1];
    dReal k2 = m21*Sb[a1];
    dReal k3 = m12*Sb[a2];
    dReal k4 = m22*Sb[a2];
    quad[0] = c1 - k1 - k3;
    quad[1] = c2 - k2 - k4;
    quad[2] = c1 - k1 + k3;
    quad[3] = c2 - k2 + k4;
    quad[4] = c1 + k1 + k3;
    quad[5] = c2 + k2 + k4;
    quad[6] = c1 + k1 - k3;
    quad[7] = c2 + k2 - k4;
  }

  // find the size of the reference face
  dReal rect[2];
  rect[0] = Sa[code1];
  rect[1] = Sa[code2];

  // intersect the incident and reference faces
  dReal ret[16];
  int n = intersectRectQuad (rect,quad,ret);
  if (n < 1) return 0;		// this should never happen

  // convert the intersection points into reference-face coordinates,
  // and compute the contact position and depth for each point. only keep
  // those points that have a positive (penetrating) depth. delete points in
  // the 'ret' array as necessary so that 'point' and 'ret' correspond.
  dReal point[3*8];		// penetrating contact points
  dReal dep[8];			// depths for those points
  dReal det1 = dRecip(m11*m22 - m12*m21);
  m11 *= det1;
  m12 *= det1;
  m21 *= det1;
  m22 *= det1;
  int cnum = 0;			// number of penetrating contact points found
  for (j=0; j < n; j++) {
    dReal k1 =  m22*(ret[j*2]-c1) - m12*(ret[j*2+1]-c2);
    dReal k2 = -m21*(ret[j*2]-c1) + m11*(ret[j*2+1]-c2);
    for (i=0; i<3; i++) point[cnum*3+i] =
			  center[i] + k1*Rb[i*4+a1] + k2*Rb[i*4+a2];
    dep[cnum] = Sa[codeN] - dDOT(normal2,point+cnum*3);
    if (dep[cnum] >= 0) {
      ret[cnum*2] = ret[j*2];
      ret[cnum*2+1] = ret[j*2+1];
      cnum++;
    }
  }
  if (cnum < 1) return 0;	// this should never happen

  // we can't generate more contacts than we actually have
  if (maxc > cnum) maxc = cnum;
  if (maxc < 1) maxc = 1;

  if (cnum <= maxc) {
    // we have less contacts than we need, so we use them all
    for (j=0; j < cnum; j++) {
      dContactGeom *con = CONTACT(contact,skip*j);
      for (i=0; i<3; i++) con->pos[i] = point[j*3+i] + pa[i];
      con->depth = dep[j];
    }
  }
  else {
    // we have more contacts than are wanted, some of them must be culled.
    // find the deepest point, it is always the first contact.
    int i1 = 0;
    dReal maxdepth = dep[0];
    for (i=1; i<cnum; i++) {
      if (dep[i] > maxdepth) {
	maxdepth = dep[i];
	i1 = i;
      }
    }

    int iret[8];
    cullPoints (cnum,ret,maxc,i1,iret);

    for (j=0; j < maxc; j++) {
      dContactGeom *con = CONTACT(contact,skip*j);
      for (i=0; i<3; i++) con->pos[i] = point[iret[j]*3+i] + pa[i];
      con->depth = dep[iret[j]];
    }
    cnum = maxc;
  }

  *return_code = code;
  return cnum;
}



int dCollideBoxBox (dxGeom *o1, dxGeom *o2, int flags,
		    dContactGeom *contact, int skip)
{
  dIASSERT (skip >= (int)sizeof(dContactGeom));
  dIASSERT (o1->type == dBoxClass);
  dIASSERT (o2->type == dBoxClass);
  dVector3 normal;
  dReal depth;
  int code;
  dxBox *b1 = (dxBox*) o1;
  dxBox *b2 = (dxBox*) o2;
  int num = dBoxBox (o1->final_posr->pos,o1->final_posr->R,b1->side, o2->final_posr->pos,o2->final_posr->R,b2->side,
		     normal,&depth,&code,flags & NUMC_MASK,contact,skip);
  for (int i=0; i<num; i++) {
    CONTACT(contact,i*skip)->normal[0] = -normal[0];
    CONTACT(contact,i*skip)->normal[1] = -normal[1];
    CONTACT(contact,i*skip)->normal[2] = -normal[2];
    CONTACT(contact,i*skip)->g1 = o1;
    CONTACT(contact,i*skip)->g2 = o2;
  }
  return num;
}


int dCollideBoxPlane (dxGeom *o1, dxGeom *o2,
		      int flags, dContactGeom *contact, int skip)
{
  dIASSERT (skip >= (int)sizeof(dContactGeom));
  dIASSERT (o1->type == dBoxClass);
  dIASSERT (o2->type == dPlaneClass);
  dxBox *box = (dxBox*) o1;
  dxPlane *plane = (dxPlane*) o2;

  contact->g1 = o1;
  contact->g2 = o2;
  int ret = 0;

  //@@@ problem: using 4-vector (plane->p) as 3-vector (normal).
  const dReal *R = o1->final_posr->R;		// rotation of box
  const dReal *n = plane->p;		// normal vector

  // project sides lengths along normal vector, get absolute values
  dReal Q1 = dDOT14(n,R+0);
  dReal Q2 = dDOT14(n,R+1);
  dReal Q3 = dDOT14(n,R+2);
  dReal A1 = box->side[0] * Q1;
  dReal A2 = box->side[1] * Q2;
  dReal A3 = box->side[2] * Q3;
  dReal B1 = dFabs(A1);
  dReal B2 = dFabs(A2);
  dReal B3 = dFabs(A3);

  // early exit test
  dReal depth = plane->p[3] + REAL(0.5)*(B1+B2+B3) - dDOT(n,o1->final_posr->pos);
  if (depth < 0) return 0;

  // find number of contacts requested
  int maxc = flags & NUMC_MASK;
  if (maxc < 1) maxc = 1;
  if (maxc > 3) maxc = 3;	// no more than 3 contacts per box allowed

  // find deepest point
  dVector3 p;
  p[0] = o1->final_posr->pos[0];
  p[1] = o1->final_posr->pos[1];
  p[2] = o1->final_posr->pos[2];
#define FOO(i,op) \
  p[0] op REAL(0.5)*box->side[i] * R[0+i]; \
  p[1] op REAL(0.5)*box->side[i] * R[4+i]; \
  p[2] op REAL(0.5)*box->side[i] * R[8+i];
#define BAR(i,iinc) if (A ## iinc > 0) { FOO(i,-=) } else { FOO(i,+=) }
  BAR(0,1);
  BAR(1,2);
  BAR(2,3);
#undef FOO
#undef BAR

  // the deepest point is the first contact point
  contact->pos[0] = p[0];
  contact->pos[1] = p[1];
  contact->pos[2] = p[2];
  contact->normal[0] = n[0];
  contact->normal[1] = n[1];
  contact->normal[2] = n[2];
  contact->depth = depth;
  ret = 1;		// ret is number of contact points found so far
  if (maxc == 1) goto done;

  // get the second and third contact points by starting from `p' and going
  // along the two sides with the smallest projected length.

#define FOO(i,j,op) \
  CONTACT(contact,i*skip)->pos[0] = p[0] op box->side[j] * R[0+j]; \
  CONTACT(contact,i*skip)->pos[1] = p[1] op box->side[j] * R[4+j]; \
  CONTACT(contact,i*skip)->pos[2] = p[2] op box->side[j] * R[8+j];
#define BAR(ctact,side,sideinc) \
  depth -= B ## sideinc; \
  if (depth < 0) goto done; \
  if (A ## sideinc > 0) { FOO(ctact,side,+) } else { FOO(ctact,side,-) } \
  CONTACT(contact,ctact*skip)->depth = depth; \
  ret++;

  CONTACT(contact,skip)->normal[0] = n[0];
  CONTACT(contact,skip)->normal[1] = n[1];
  CONTACT(contact,skip)->normal[2] = n[2];
  if (maxc == 3) {
    CONTACT(contact,2*skip)->normal[0] = n[0];
    CONTACT(contact,2*skip)->normal[1] = n[1];
    CONTACT(contact,2*skip)->normal[2] = n[2];
  }

  if (B1 < B2) {
    if (B3 < B1) goto use_side_3; else {
      BAR(1,0,1);	// use side 1
      if (maxc == 2) goto done;
      if (B2 < B3) goto contact2_2; else goto contact2_3;
    }
  }
  else {
    if (B3 < B2) {
      use_side_3:	// use side 3
      BAR(1,2,3);
      if (maxc == 2) goto done;
      if (B1 < B2) goto contact2_1; else goto contact2_2;
    }
    else {
      BAR(1,1,2);	// use side 2
      if (maxc == 2) goto done;
      if (B1 < B3) goto contact2_1; else goto contact2_3;
    }
  }

  contact2_1: BAR(2,0,1); goto done;
  contact2_2: BAR(2,1,2); goto done;
  contact2_3: BAR(2,2,3); goto done;
#undef FOO
#undef BAR

 done:
  for (int i=0; i<ret; i++) {
    CONTACT(contact,i*skip)->g1 = o1;
    CONTACT(contact,i*skip)->g2 = o2;
  }
  return ret;
}
