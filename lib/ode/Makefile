#########################################################################
#                                                                       #
# Open Dynamics Engine, by Russell L. Smith.(2002)                      #
#   Email: russ@q12.org   Web: www.q12.org                              #
#                                                                       #
#                                                                       #
#                                                                       #
# This library is free software; you can redistribute it and/or         #
# modify it under the terms of the GNU Lesser General Public            #
# License as published by the Free Software Foundation; either          #
# version 2.1 of the License, or (at your option) any later version.    #
#                                                                       #
# This library is distributed in the hope that it will be useful,       #
# but WITHOUT ANY WARRANTY; without even the implied warranty of        #
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU      #
# Lesser General Public License for more details.                       #
#                                                                       #
# You should have received a copy of the GNU Lesser General Public      #
# License along with this library (see the file LICENSE.TXT); if not,   #
# write to the Free Software Foundation, Inc., 59 Temple Place,         #
# Suite 330, Boston, MA 02111-1307 USA.                                 #
#                                                                       #
#########################################################################

##############################################################################
# Makefile by Ricku34
##############################################################################


##############################################################################
# package settings

ODE_SRC = \
	array.o \
	error.o \
	memory.o \
	obstack.o \
	odemath.o \
	matrix.o \
	misc.o \
	rotation.o \
	mass.o \
	ode.o \
	step.o \
	lcp.o \
	joint.o \
	space.o \
	geom.o \
	timer.o \
	mat.o \
	testing.o
ODE_PREGEN_SRC = \
	fastldlt.o \
	fastlsolve.o \
	fastltsolve.o \
	fastdot.o

EXPORTED_FUNCTIONS = \
	'_dWorldCreate', '_dWorldDestroy', '_dWorldSetGravity', '_dWorldGetGravity', '_dWorldStep', \
	'_dBodyCreate', '_dBodyDestroy', '_dBodySetPosition', '_dBodySetRotation', '_dBodySetQuaternion', '_dBodySetLinearVel', '_dBodySetAngularVel'

ODE_LIB_NAME=ode

INCPATH=../../include
LIBPATH=..


##############################################################################
# derived things


# object file names
ODE_PREGEN_OBJECTS=$(ODE_PREGEN_SRC:%.c=%$(OBJ))
ODE_OBJECTS=$(ODE_SRC:%.cpp=%$(OBJ)) $(ODE_PREGEN_OBJECTS)

# library file names
ODE_LIB=$(LIBPATH)\lib$(ODE_LIB_NAME).js



CFLAGS += -I$(INCPATH) -DWIN32 -DCYGWIN 

##############################################################################
# rules
#

all: ode-lib 
	@echo SUCCESS

ode-lib: $(ODE_LIB)

$(ODE_LIB): $(ODE_OBJECTS)
	emcc -O2 --memory-init-file 0 -v -s TOTAL_MEMORY=33554432 $(ODE_OBJECTS) -o $@ -s EXPORTED_FUNCTIONS="[$(EXPORTED_FUNCTIONS)]" --pre-js pre.js --post-js post.js

clean:
	@del $(ODE_LIB) $(ODE_OBJECTS)

%.o: %.cpp
	em++ $(CFLAGS) -c $< 
	
%.o: %.c
	emcc $(CFLAGS) -c $< 
