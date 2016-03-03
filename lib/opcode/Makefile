#
# libOpcode
#

OBJS = 	OPC_AABB.o									\
		OPC_AABBCollider.o					\
		OPC_AABBTree.o							\
		OPC_Collider.o							\
		OPC_Common.o								\
		OPC_Container.o							\
		OPC_Matrix3x3.o							\
		OPC_Matrix4x4.o							\
		OPC_Model.o									\
		OPC_OBB.o										\
		OPC_OBBCollider.o						\
		OPC_OptimizedTree.o 				\
		OPC_Plane.o									\
		OPC_PlanesCollider.o				\
		OPC_Point.o									\
		OPC_Ray.o										\
		OPC_RayCollider.o						\
		OPC_SphereCollider.o				\
		OPC_TreeBuilders.o					\
		OPC_TreeCollider.o					\
		OPC_Triangle.o							\
		OPC_VolumeCollider.o				\
		Opcode.o

# library file names
LIBPATH=..

SUBDIRS =
INCLUDE_PATH = ../../include/
INCLUDE_OPCODE = $(INCLUDE_PATH)/opcode
CFLAGS += -I$(INCLUDE_OPCODE)

OPCODE_LIB=$(LIBPATH)\libopcode.js

all: opcode-lib 
	@echo SUCCESS

opcode-lib: $(OPCODE_LIB)

$(OPCODE_LIB): $(OBJS)
	emcc --memory-init-file 0 -v -s TOTAL_MEMORY=33554432 $(OBJS)  -o $@ 

clean:
	@del $(OPCODE_LIB) $(OBJS)

%.o: %.cpp
	em++ $(CFLAGS) -c $< 
	
%.o: %.c
	emcc $(CFLAGS) -c $< 


