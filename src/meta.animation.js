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
   <class name="Meta.animation">
   <desc>Animation extensions</desc>
 */
Meta.animation=function()
{
  var ev=Meta.events.bro(),
      fps=1000/30,
      bakList=['width',
               'height',
               'left',
               'top',
               'display',
               'visibility',
               'overflow',
               'filter',
               'MozOpacity',
               'zoom',
               'opacity',
               'KHTMLOpacity'];

  ev.onFireEvent=function(a,b)
  {
    if(a.type=='frameStep')
    {
      if(b)
	setTimeout(ev.callback('fireEvent','frameStep',ev),fps);
      else
      {
	ev.rmEvent('frameStep',ev);
	ev.fireEvent('stopAnim',ev);
	ev.rmEvent('stopAnim',ev);
      }
    }
  };

  /**
   * Start the animation
   * object   cb    - Callback to use when finish
   * integer  x0    - Starting point
   * integer  x1    - Ending point
   * integer  speed - Time it takes to complete the animation, in milliseconds
   * function fn    - Callback function that creates the new frames
   * object   [obj] - Object to use as this
   */
  function anim(cb,x0,x1,speed,fn,obj)
  {
    var t0=(new Date()).getTime(),
        t1=t0+(speed||200),
        dx=x1-x0,
        dt=t1-t0,
        me=this;

    function frk()
    {
      var t=(new Date()).getTime(),
          x=x0+(t-t0)*dx/dt; // Translacion lineal

      // Termino la animacion
      if(t>=t1)return false;

      fn.call(obj,x);
      return undefined;
    };

    function frk2()
    {
      if(cb)cb.call(me,obj);
    };

    ev.addEvent('frameStep',ev,frk);
    ev.addEvent('stopAnim',ev,frk2);
    ev.fireEvent('frameStep',ev);
  };

  return {
    data:'data-meta_',

      /**
         <method name="cssBackup" type="this">
         <desc>Backup important element css</desc>
         </method>
      */
      cssBackup:function()
      {
        var a=Meta.dom.bro(),
	    b=bakList,c,
	    me=this;

        return me.forEach(function(v)
                          {
			    a.set(v);

			    var d=parseInt(a.attr(me.data+'bak'),10)||0;
			    a.attr(me.data+'bak',d+1);

			    if(d)
			      return;

			    Meta.each(b,function(v)
				      {
					c=a.css(v);
					if(c!==null)a.attr(me.data+v,c);
				      });

			    if(!a.attr(me.data+'size_w'))
			    {
			      c=a.dims();
			      a.attr(me.data+'size_w',c.width)
				.attr(me.data+'size_h',c.height);
			    }

			    if(!a.attr(me.data+'pos_l'))
			    {
			      c=a.dims();
			      a.attr(me.data+'pos_l',c.left)
				.attr(me.data+'pos_t',c.top);
			    }
			  });
      },

      /**
       <method name="cssRestore" type="this">
       <param name="[d]" type="string">CSS to restore.</param>
       <desc>Restore important element css</desc>
       </method>
      */
      cssRestore:function(d)
      {
        var a=Meta.dom.bro(),
	    b=bakList,c,
	    me=this;

	function restore(v)
	{
	  c=a.attr(me.data+v);
	  a.css(v,'');
	  if(c!==null)a.css(v,c);
	};

        return me.forEach(function(v)
                          {
			    if(!a.set(v).attr(me.data+'bak'))
			      return;

			    if(d)
			      restore(d);
			    else
			      Meta.each(b,restore);
                          });
      },

      /**
       <method name="cssBackupClear" type="this">
       <desc>Clears the css backup important element css</desc>
       </method>
      */
      cssBackupClear:function()
      {
        var a=Meta.dom.bro(),
            b=bakList,
	    me=this;

        return me.forEach(function(v)
                          {
			    a.set(v);

			    Meta.each(b,function(v)
				      {
					a.attr(me.data+v,null);
				      });

			    a.attr(me.data+'bak',null).
			      attr(me.data+'size_w',null).
			      attr(me.data+'size_h',null).
			      attr(me.data+'pos_l',null).
			      attr(me.data+'pos_t',null);
                          });
      },

    /**
     <method name="animate" type="this">
     <desc>Custom animation</desc>
     <param name="x0"    type="function">Returns the starting point, its called with the element as this</param>
     <param name="x1"    type="function">Returns the ending point, its called  with the element as this</param>
     <param name="speed" type="integer">Time it takes to complete the animation, in milliseconds</param>
     <param name="fn"    type="function">Callback function that creates the new frames</param>
     <param name="[cb]"  type="function">Callback function to call when the animation finishes succesfully</param>
     <param name="[r]"   type="bool">Flag to Restore after the animation stops.</param>
     </method>
     */
    animate:function(x0,x1,speed,fn,cb,r)
    {
      var me=this;

      me.cssBackup();
      me.cssRestore('display');

      if(!me.__)ev.addEvent('stopAnim',ev,function()
			    {
			      if(r)
				{
				  me.cssRestore();
				  me.cssBackupClear();
				}
			      me.__=0;
			    });
      me.__=1;

      return this.forEach(function(v)
			  {
			    anim.call(me,cb,x0.call(v),x1.call(v),speed,fn,v);
			  });
    },

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
     <param name="[cb]" type="function">Calback function to be called after the animation finishes</param>
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
	    css('width',b+'px').
	    css('overflow','hidden');
        },

      // Setea el alto del elemento
      h=function(b)
	{
          a.set(this).
	    css('height',b+'px').
	    css('overflow','hidden');
        },

      // Setea el ancho y alto del elemento
      wh=function(b)
	{
          a.set(this);
          var c=[a.attr(me.data+'size_w'),a.attr(me.data+'size_h')];
          a.css('width',(b*c[0])+'px').
	    css('height',(b*c[1])+'px').
	    css('overflow','hidden');
        },

      // Devuelve el elemento a la normalidad
      cb0=function(o)
	{
          if(cb)cb.call(me,o);
        },

      // Esconde por completo el elemento y llamar el callback
      cb1=function(o)
	{
          a.set(o).hide();
          if(cb)cb.call(me,o);
        };



      // Tipos de animaciones
      switch(md)
	{
	  case 'up-left':
            x0=s3;
            x1=s0;
            fn=wh;
            cb0=cb1;
            break;
          case 'right':
            x0=s0;
            x1=s1;
            fn=w;
	    r=1;
            break;
          case 'left':
            x0=s1;
            x1=s0;
            fn=w;
            cb0=cb1;
            break;
          case 'up':
            x0=s2;
            x1=s0;
            fn=h;
            cb0=cb1;
            break;
          case 'down':
            x0=s0;
            x1=s2;
            fn=h;
	    r=1;
            break;
          default: //down-right
            x0=s0;
            x1=s3;
            fn=wh;
	    r=1;
        }

	return me.animate(x0,x1,speed,fn,cb0,r);
    },

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
     <param name="[cb]" type="function">Calback function to be called after the animation finishes</param>
     </method>
     */
    fade:function(mode,speed,cb)
    {
      var me=this,
	  a=Meta.dom.bro(),
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
	  if(cb)cb.call(me,o);
        },

      // Esconde por completo el elemento
      cb1=function(o)
        {
          a.set(o).hide();
          if(cb)cb.call(me,o);
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

      return this.animate(x0,x1,speed,fn,cb0,r);
    }
  };
}();
/** </class> */
