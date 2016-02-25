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

/*

TODO
----

* gettimeofday() and the pentium time stamp counter return the real time,
  not the process time. fix this somehow!

*/
#include <sys/time.h>
#include <unistd.h>
#include <ode/common.h>
#include <ode/timer.h>

// misc defines
#define ALLOCA dALLOCA16

//****************************************************************************
// implementation for windows based on the multimedia performance counter.



//****************************************************************************
// otherwise, do the implementation based on gettimeofday().


/*#include <sys/time.h>
#include <unistd.h>
*/

static inline void getClockCount (unsigned long cc[2])
{
  struct timeval tv;
  gettimeofday (&tv,0);
  cc[0] = tv.tv_usec;
  cc[1] = tv.tv_sec;
}


static inline void serialize()
{
}


static inline double loadClockCount (unsigned long a[2])
{
  return a[1]*1.0e6 + a[0];
}


double dTimerResolution()
{
  unsigned long cc1[2],cc2[2];
  getClockCount (cc1);
  do {
    getClockCount (cc2);
  }
  while (cc1[0]==cc2[0] && cc1[1]==cc2[1]);
  do {
    getClockCount (cc1);
  }
  while (cc1[0]==cc2[0] && cc1[1]==cc2[1]);
  double t1 = loadClockCount (cc1);
  double t2 = loadClockCount (cc2);
  return (t1-t2) / dTimerTicksPerSecond();
}


double dTimerTicksPerSecond()
{
  return 1000000;
}


//****************************************************************************
// stop watches

void dStopwatchReset (dStopwatch *s)
{
  s->time = 0;
  s->cc[0] = 0;
  s->cc[1] = 0;
}


void dStopwatchStart (dStopwatch *s)
{
  serialize();
  getClockCount (s->cc);
}


void dStopwatchStop  (dStopwatch *s)
{
  unsigned long cc[2];
  serialize();
  getClockCount (cc);
  double t1 = loadClockCount (s->cc);
  double t2 = loadClockCount (cc);
  s->time += t2-t1;
}


double dStopwatchTime (dStopwatch *s)
{
  return s->time / dTimerTicksPerSecond();
}

//****************************************************************************
// code timers

// maximum number of events to record
#define MAXNUM 100

static int num = 0;		// number of entries used in event array
static struct {
  unsigned long cc[2];		// clock counts
  double total_t;		// total clocks used in this slot.
  double total_p;		// total percentage points used in this slot.
  int count;			// number of times this slot has been updated.
  char *description;		// pointer to static string
} event[MAXNUM];


// make sure all slot totals and counts reset to 0 at start

static void initSlots()
{
  static int initialized=0;
  if (!initialized) {
    for (int i=0; i<MAXNUM; i++) {
      event[i].count = 0;
      event[i].total_t = 0;
      event[i].total_p = 0;
    }
    initialized = 1;
  }
}


void dTimerStart (const char *description)
{
  initSlots();
  event[0].description = const_cast<char*> (description);
  num = 1;
  serialize();
  getClockCount (event[0].cc);
}


void dTimerNow (const char *description)
{
  if (num < MAXNUM) {
    // do not serialize
    getClockCount (event[num].cc);
    event[num].description = const_cast<char*> (description);
    num++;
  }
}


void dTimerEnd()
{
  if (num < MAXNUM) {
    serialize();
    getClockCount (event[num].cc);
    event[num].description = "TOTAL";
    num++;
  }
}

//****************************************************************************
// print report

static void fprintDoubleWithPrefix (FILE *f, double a, char *fmt)
{
  if (a >= 0.999999) {
    fprintf (f,fmt,a);
    return;
  }
  a *= 1000.0;
  if (a >= 0.999999) {
    fprintf (f,fmt,a);
    fprintf (f,"m");
    return;
  }
  a *= 1000.0;
  if (a >= 0.999999) {
    fprintf (f,fmt,a);
    fprintf (f,"u");
    return;
  }
  a *= 1000.0;
  fprintf (f,fmt,a);
  fprintf (f,"n");
}


void dTimerReport (FILE *fout, int average)
{
  int i,maxl;
  double ccunit = 1.0/dTimerTicksPerSecond();
  fprintf (fout,"\nTimer Report (");
  fprintDoubleWithPrefix (fout,ccunit,"%.2f ");
  fprintf (fout,"s resolution)\n------------\n");
  if (num < 1) return;

  // get maximum description length
  maxl = 0;
  for (i=0; i<num; i++) {
    int l = strlen (event[i].description);
    if (l > maxl) maxl = l;
  }

  // calculate total time
  double t1 = loadClockCount (event[0].cc);
  double t2 = loadClockCount (event[num-1].cc);
  double total = t2 - t1;
  if (total <= 0) total = 1;

  // compute time difference for all slots except the last one. update totals
  double *times = (double*) ALLOCA (num * sizeof(double));
  for (i=0; i < (num-1); i++) {
    double t1 = loadClockCount (event[i].cc);
    double t2 = loadClockCount (event[i+1].cc);
    times[i] = t2 - t1;
    event[i].count++;
    event[i].total_t += times[i];
    event[i].total_p += times[i]/total * 100.0;
  }

  // print report (with optional averages)
  for (i=0; i<num; i++) {
    double t,p;
    if (i < (num-1)) {
      t = times[i];
      p = t/total * 100.0;
    }
    else {
      t = total;
      p = 100.0;
    }
    fprintf (fout,"%-*s %7.2fms %6.2f%%",maxl,event[i].description,
	     t*ccunit * 1000.0, p);
    if (average && i < (num-1)) {
      fprintf (fout,"  (avg %7.2fms %6.2f%%)",
	       (event[i].total_t / event[i].count)*ccunit * 1000.0,
	       event[i].total_p / event[i].count);
    }
    fprintf (fout,"\n");
  }
  fprintf (fout,"\n");
}
