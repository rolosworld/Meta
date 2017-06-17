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
 <class name="Meta.websocket">
 <desc>WebSocket manager</desc>
 <inherit>Meta.websocketevent</inherit>
 */
Meta.websocket=Meta(Meta.websocketevent).extend({
  /**
     <method name="connect" type="this">
     <desc>Connect to the given url</desc>
     <param name="u" type="string">WebSocket URL</param>
     </method>
  */
  connect: function(u) {
    var me = this;
    me.set(new WebSocket(u));
    me.fire('connect');
    return me;
  },

  /**
     <method name="close" type="this">
     <desc>Close the connection</desc>
     </method>
  */
  close: function() {
    var me = this;
    var a = me.get();
    if (a) {
        a.close();
    }
    me.fire('close');
    return me;
  },

  /**
     <method name="send" type="this">
     <desc>Send the given string to the server</desc>
     <param name="d" type="string">String to send</param>
     </method>
  */
  send: function(d) {
    var me = this;
    var j=JSON.encode(d);
    me.get().send(j);
    me.fire('send',j);
    return me;
  }
});
/** </class> */
