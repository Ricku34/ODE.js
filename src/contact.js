    /**************                                   Contact Object                                   *********************/
    var sizeOfCantact= 104;

    ODE.Contact = (function()
    {
        var contact = function(/*pointer*/)
        {
            var pointer = arguments[0] ||  Module._malloc(sizeOfCantact);
            this.getPointer = function() { return pointer;}
            this.surface = {};
            Object.defineProperties(this.surface, {
                mode : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer,'i32') },
                    set : function(val) {  	 Module.setValue(pointer,val,'i32')	}
                },
                mu : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+4,'float') },
                    set : function(val) {  	 Module.setValue(pointer+4,val,'float')	}
                },
                mu2 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+8,'float') },
                    set : function(val) {  	 Module.setValue(pointer+8,val,'float')	}
                },
                bounce : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+12,'float') },
                    set : function(val) {  	 Module.setValue(pointer+12,val,'float')	}
                },
                bounce_vel : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+16,'float') },
                    set : function(val) {  	 Module.setValue(pointer+16,val,'float')	}
                },
                soft_erp : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+20,'float') },
                    set : function(val) {  	 Module.setValue(pointer+20,val,'float')	}
                },
                soft_cfm : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+24,'float') },
                    set : function(val) {  	 Module.setValue(pointer+24,val,'float')	}
                },
                motion1 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+28,'float') },
                    set : function(val) {  	 Module.setValue(pointer+24,val,'float')	}
                },
                motion2 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+32,'float') },
                    set : function(val) {  	 Module.setValue(pointer+32,val,'float')	}
                },
                slip1 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+36,'float') },
                    set : function(val) {  	 Module.setValue(pointer+36,val,'float')	}
                },
                slip2 : {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+40,'float') },
                    set : function(val) {  	 Module.setValue(pointer+40,val,'float')	}
                }
            });
            this.geom={};
            Object.defineProperties(this.geom, {
                pos : {
                    enumerable : true,
                    get : function(){ return [ Module.getValue(pointer+44,'float'), Module.getValue(vec4+48,'float'), Module.getValue(vec4+52,'float') ];},
                    set : function(val) { Module.setValue(pointer+44,val[0],'float'), Module.setValue(pointer+48,val[1],'float'),Module.setValue(pointer+52,val[2],'float')	}
                },
                normal: {
                    enumerable : true,
                    get : function(){ return [ Module.getValue(pointer+60,'float'), Module.getValue(vec4+64,'float'), Module.getValue(vec4+68,'float') ];},
                    set : function(val) { Module.setValue(pointer+60,val[0],'float'), Module.setValue(pointer+64,val[1],'float'),Module.setValue(pointer+68,val[2],'float')	}
                },
                depth: {
                    enumerable : true,
                    get : function(){ return Module.getValue(pointer+76,'float') },
                    set : function(val) {  	 Module.setValue(pointer+76,val,'float')	}
                },
                g1 : {
                    enumerable : true,
                    get : function()
                    {
                        var p = Module.getValue(pointer+80,'i32');
                        return (p)? new Geom(p) : null;
                    },
                    set : function(val) {  	 Module.setValue(pointer+80,val.getPointer(),'i32')	}
                },
                g2  : {
                    enumerable : true,
                    get : function()
                    {
                        var p =  Module.getValue(pointer+84,'i32');
                        return (p)? new Geom(p) : null;
                    },
                    set : function(val) {  	 Module.setValue(pointer+84,val.getPointer(),'i32')	}
                }
            });
            Object.defineProperty(this,"fdir1",{
                enumerable : true,
                get : function(){ return [ Module.getValue(pointer+88,'float'), Module.getValue(vec4+92,'float'), Module.getValue(vec4+96,'float') ];},
                set : function(val) { Module.setValue(pointer+88,val[0],'float'), Module.setValue(pointer+92,val[1],'float'),Module.setValue(pointer+96,val[2],'float')	}
            });
        }
        contact.Mode = {
            Mu2		: 0x001,
            FDir1	: 0x002,
            Bounce	: 0x004,
            SoftERP	: 0x008,
            SoftCFM	: 0x010,
            Motion1	: 0x020,
            Motion2	: 0x040,
            Slip1	: 0x080,
            Slip2	: 0x100,

            Approx0	: 0x0000,
            Approx1_1	: 0x1000,
            Approx1_2	: 0x2000,
            Approx1	: 0x3000
        };
        return contact;
    })()