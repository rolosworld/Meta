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
   <class name="Meta.animation.slide">
   <desc>Animation extensions for Meta.animation</desc>
 */
Meta.inherit(Meta.animation,{
  /**
   <method name="slide" type="this">
   <desc>
   Slide the elements.
   Slide types:
   - right       show
   - left        hide
   - down        show
   - up          hide
   - down-right  show
   - up-left     hide
   </desc>
   <param name="md" type="string">Type of the slide to do</param>
   <param name="[speed]" type="integer">Milliseconds the animation will last</param>
   <param name="[cb]" type="function">Callback function to be called after the animation finishes</param>
   </method>
   */
  slide:function(md,speed,cb)
  {
    var me=this,
        a=Meta.dom.bro(),
	x0,x1,fn,r,

    // Manejan los maximos y minimos
    s0=function(){return 0;},
    s1=function(){return a.set(this).dims().width;},
    s2=function(){return a.set(this).dims().height;},
    s3=function(){return 1;},

    // Setea el ancho del elemento
    w=function(b)
    {
      a.set(this).
	css('width',b+'px');
    },

    // Setea el alto del elemento
    h=function(b)
    {
      a.set(this).
	css('height',b+'px');
    },

    // Setea el ancho y alto del elemento
    wh=function(b)
    {
      a.set(this);
      var c=[a.attr(me.data+'size_w'),a.attr(me.data+'size_h')];
      a.css('width',(b*c[0])+'px').
	css('height',(b*c[1])+'px');
    },
    
    ini=function(v)
    {
      a.set(v).
	css('overflow','hidden');
    },

    // Devuelve el elemento a la normalidad
    cb0=function(o)
    {
      if(cb)
        cb.call(me,o);
    },

    // Esconde por completo el elemento y llamar el callback
    cb1=function(o)
    {
      a.set(o).hide();
      if(cb)
        cb.call(me,o);
    };



    // Tipos de animaciones
    ({
      'up-left':function(){
        x0=s3;
        x1=s0;
        fn=wh;
        cb0=cb1;
      },
      right:function(){
        x0=s0;
        x1=s1;
        fn=w;
        r=1;
      },
      left:function(){
        x0=s1;
        x1=s0;
        fn=w;
        cb0=cb1;
      },
      up:function(){
        x0=s2;
        x1=s0;
        fn=h;
        cb0=cb1;
      },
      down:function(){
        x0=s0;
        x1=s2;
        fn=h;
        r=1;
      },
      'down-right':function(){
        x0=s0;
        x1=s3;
        fn=wh;
        r=1;
      }
    })[md]();

    return me.animate(x0,x1,speed,ini,fn,cb0,r);
  }
});
/** </class> */