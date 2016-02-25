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
SUBDIRS =
INCLUDE_PATH = ../../include/
INCLUDE_OPCODE = $(INCLUDE_PATH)/opcode
KOS_CFLAGS += -I$(INCLUDE_OPCODE) -O2

myall: $(OBJS)
	rm -f ../libopcode.a
	$(KOS_AR) rcs ../libopcode.a $(OBJS)

include $(KOS_BASE)/Makefile.prefab


