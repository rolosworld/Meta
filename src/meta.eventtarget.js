/*
 Copyright (c) 2015 Rolando González Chévere <rolosworld@gmail.com>
 
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
 <class name="Meta.eventtarget">
 <desc>WebSocket events manager</desc>
 <inherit>Meta.events</inherit>
 */
Meta.eventtarget=Meta(Meta.events).extend({
  valid_type:'',
  wrapped:function(a){
    return this.valid_type.indexOf(' '+a+' ')!=-1;
  },
  
  onNewEvent:function(a)
  {
    if(!this.wrapped(a.type))
      return;

    if(Meta.has(a.obj,'addEventListener'))
      a.obj.addEventListener(a.type,a.cb,false);
    else if(Meta.has(a.obj,'attachEvent'))
      a.obj.attachEvent("on"+a.type,a.cb);
  },

  onEmptyEvent:function(a)
  {
    if(!this.wrapped(a.type))
      return;

    if(Meta.has(a.obj,'removeEventListener'))
      a.obj.removeEventListener(a.type,a.cb,false);
    else if(Meta.has(a.obj,'detachEvent'))
      a.obj.detachEvent('on'+a.type,a.cb);
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
    var w=me.wrapped(a)?me.get():me;
    if(b)
      return me.addEvent(a,w,b);
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
  fire:function(a,b)
  {
    var me=this;
    var w=me.wrapped(a)?me.get():me;
    return me.fireEvent(a,w,b);
  },

  /**
   <method name="rmOn" type="this">
   <desc>Remove the given event callback</desc>
   <param name="a" type="string">Event type</param>
   <param name="[b]" type="function">Callback on current event</param>
   </method>
   */
  rmOn:function(a,b)
  {
    var me=this;
    var w=me.wrapped(a)?me.get():me;
    return me.rmEvent(a,w,b);
  }
});
/** </class> */
