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
 <class name="Meta.domevent">
 <desc>DOM events manager</desc>
 <inherit>Meta.eventtarget</inherit>
 <extend>Meta.array</extend>
 */
Meta.domevent=Meta(Meta.eventtarget).extend(Meta.array).extend({
  valid_type:' abort blur change click dblclick error focus keydown keypress keyup load mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend reset resize select submit unload hashchange ',

  onFireEvent:function(a,b,c)
  {
    if(b || !this.wrapped(a.type))
      return;

    // Force stop the event
    c[0].cancelBubble=true;
    c[0].returnValue=false;

    if(c[0].stopPropagation)
      c[0].stopPropagation();

    if(c[0].preventDefault)
      c[0].preventDefault();
  },

  /**
   <method name="on" type="mixed">
   <param name="a" type="string">Event type</param>
   <param name="b" type="function">Callback for the event</param>
   <desc>
   Adds a new event. If the callback returns false it stops the
   event from propagation. The callback is called the same way
   it would be called by the browser event, "this" is the element
   and received the event as an argument.
   </desc>
   </method>
   */
  on:function(a,b)
  {
    var me=this;
    if(b)
      return me.forEach(function(v){me.addEvent(a,v,b);});
  },

  /**
   <method name="fire" type="mixed">
   <desc>
   Fires the given event type.
   Returns this.
   </desc>
   <param name="a" type="string">Event type</param>
   </method>
   */
  fire:function(a)
  {
    var me=this;
    return me.forEach(function(v)
      {
	if(v['on'+a])
	  v['on'+a]();
        
	me.fireEvent(a,v);
      });
  },

  /**
   <method name="off" type="this">
   <desc>Remove the given event callback</desc>
   <param name="a" type="string">Event type</param>
   <param name="[b]" type="function">Callback on current event</param>
   </method>
   */
  off:function(a,b)
  {
    var me=this;
    return me.forEach(function(v){me.rmEvent(a,v,b);});
  },

  /**
   <method name="cleanEvents" type="this">
   <desc>Remove events from elements without parentNode</desc>
   </method>
  */
  cleanEvents:function()
  {
    return this.flush(function(a,b){return b['parentNode']===null;});
  },

  /**
   <method name="getTarget" type="element">
   <desc>Remove events from elements without parentNode</desc>
   </method>
  */
  getTarget:function(event)
  {
      return event.explicitOriginalTarget || event.relatedTarget || document.activeElement || {};
  }
});
/** </class> */

Meta.domevent.addEvent('unload',window,function()
  {
    Meta.events.flush();
    if(document && document.body)
      Meta.dom.purge(document.body);
  });
