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
/**
   <class name="Meta.animation.clip">
   <desc>Animation extensions for Meta.animation</desc>
 */
Meta.inherit(Meta.animation,{
  /**
   <method name="clip" type="this">
   <desc>
   Clip the elements.
   Clip types: 0-14
   4-8,10-14
   </desc>
   <param name="anim" type="string">Type of clip to do</param>
   <param name="[speed]" type="integer">Milliseconds the animation will last</param>
   <param name="[cb]" type="function">Callback function to be called after the animation finishes</param>
   </method>
   */
  clip:function(anim,speed,cb)
  {
    // position:absolute;
    var a=Meta.dom.bro(),me=this,
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
        
        // _1 - top
        // _2 - right
        // _3 - bottom
        // _4 - left
        m=function(_1,_2,_3,_4){
          a.css('clip','rect('+_1+'px '+_2+'px '+_3+'px '+_4+'px)');
        },
    
        ini=function(v){
          a.set(v).
	    css('overflow','hidden').
	    css('position','absolute');
        };
    
    // 0-14 anims
    ([
       function(){ // 0
         x0=s0;
         x1=s2;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(b,d.width,d.height,0);
         };
       },
       function(){ // 1
         x0=s1;
         x1=s0;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,b,d.height,0);
         };
       },
       function(){ // 2
         x0=s2;
         x1=s0;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,d.width,b,0);
         };
       },
       function(){ // 3
         x0=s0;
         x1=s1;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,d.width,d.height,b);
         };
       },
       function(){ // 4
         x0=s0;
         x1=s2;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(b,d.width,d.height-b,0);
         };
       },
       function(){ // 5
         x0=s0;
         x1=s1;
         fn=function(b){
           a.set(this);
           var d=a.dims();
           m(0,d.width-b,d.height,b);
         };
       },
       function(){ // 6
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width-w,d.height-h,w);
         };
       },
       function(){ // 7
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width-w,d.height,0);
         };
       },
       function(){ // 8
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(0,d.width,d.height-h,w);
         };
       },
       function(){ // 9
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
       function(){ // 10
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(0,d.width-w,d.height-h,0);
         };
       },
       function(){ // 11
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width-w,d.height-h,0);
         };
       },
       function(){ // 12
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width-w,d.height,w);
         };
       },
       function(){ // 13
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(h,d.width,d.height-h,w);
         };
       },
       function(){ // 14
         x0=s0;
         x1=s3;
         fn=function(b){
           a.set(this);
           var d=a.dims(),
               w=b*d.width,
               h=d.height*b;
           m(0,d.width-w,d.height-h,w);
         };
       }])[anim]();
    
    return this.animate(x0,x1,speed,ini,fn,cb0);
  }
});
/** </class> */