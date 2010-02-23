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
   <class name="Meta.animation.fade">
   <desc>Animation extensions for Meta.animation</desc>
 */
Meta.inherit(Meta.animation,{
  /**
   <method name="fade" type="this">
   <desc>
   Fade the elements.
   Fade types:
   - in    show
   - out   hide
   </desc>
   <param name="mode" type="string">Type of the fade to do</param>
   <param name="[speed]" type="integer">Milliseconds the animation will last</param>
   <param name="[cb]" type="function">Callback function to be called after the animation finishes</param>
   </method>
   */
  fade:function(mode,speed,cb)
  {
    var me=this,
        a=Meta.dom.$(),
	x0,x1,r,
        
    // Minimo
    s0=function(){return 0;},

    // Maximo
    s1=function(){return 1;},

    // Cambia la transparencia del elemento
    fn=function(b)
    {
      a.set(this).opacity(b);
    },

    // Devuelve el elemento a la normalidad
    cb0=function(o)
    {
      if(cb)
        cb.call(me,o);
    },

    // Esconde por completo el elemento
    cb1=function(o)
    {
      a.set(o).hide();
      if(cb)
        cb.call(me,o);
    };

    // Tipos de animaciones
    if(mode=='out')
    {
      x0=s1;
      x1=s0;
      cb0=cb1;
    }
    else // in
    {
      x0=s0;
      x1=s1;
      r=1;
    }

    return this.animate(x0,x1,speed,null,fn,cb0,r);
  }
});
/** </class> */