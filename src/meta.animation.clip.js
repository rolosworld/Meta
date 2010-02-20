/*
 Copyright (c) 2010 Rolando González Chévere <rolosworld@gmail.com>
 
 This file is part of Meta.
 
 Meta is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License version 3
 as published by the Free Software Foundation.
 
 Meta is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with Meta.  If not, see <http://www.gnu.org/licenses/>.
*/
Meta.inherit(Meta.animation,{
clip:function(anim,speed,cb)
  {
    // position:absolute;
    var a=Meta.dom.bro(),
        x0,x1,fn,
        
        // Manejan los maximos y minimos
        s0=function(){return 0;},
        s1=function(){return a.set(this).dims().width;},
        s2=function(){return a.set(this).dims().height;},
        s3=function(){return 1;},
    
        // Esconde por completo el elemento y llamar el callback
        cb0=function(o)
	{
          a.set(o).hide();
          if(cb)
            cb.call(me,o);
        },
        
        m=function(_1,_2,_3,_4){
          a.
	    css('overflow','hidden').
	    css('position','absolute').
            css('clip','rect('+_1+'px '+_2+'px '+_3+'px '+_4+'px)');
        };
    
    // 0-14 anims
    ([
       function(){
         x0=s0;
         x1=s2;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(b,d.width,d.height,0);
         };
       },
       function(){
         x0=s1;
         x1=s0;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,b,d.height,0);
         };
       },
       function(){
         x0=s2;
         x1=s0;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,d.width,b,0);
         };
       },
       function(){
         x0=s0;
         x1=s1;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,d.width,d.height,b);
         };
       },
       function(){
         x0=s0;
         x1=s2;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(b,d.width,b,0);
         };
       },
       function(){
         x0=s0;
         x1=s1;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,b,d.height,b);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,w,h,w);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,w,d.height,0);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(0,d.width,h,w);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width,d.height,w);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(0,w,h,0);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,w,h,0);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,w,d.height,w);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width,h,w);
         };
       },
       function(){
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(0,w,h,w);
         };
       }])[anim]();
    
    return this.animate(x0,x1,speed,fn,cb0);
  }
});
