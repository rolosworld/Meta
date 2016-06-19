/*
 Copyright (c) 2016 Rolando González Chévere <rolosworld@gmail.com>
 
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
   <class name="Meta.jsonrpc">
   <desc>JSONRPCv2 handler</desc>
   <inherit>Meta.array</inherit>
 */
Meta.jsonrpc=Meta(Meta(Meta.events).extend(Meta.array)).extend({
  events:{},

  /**
     <method name="url" type="this">
     <desc>Set the default URL for the JSONRPCv2 server</desc>
     <param name="u" type="string">JSONRPCv2 URL</param>
     </method>
  */
  url:function(u) {
    this.url=u;
    return this;
  },

  /**
     <method name="send" type="this">
     <desc>Send a single JSONRPC request</desc>
     <param name="d" type="hash">Data hash with the method, params and id</param>
     <param name="[c]" type="function">Callback</param>
     </method>
  */
  send:function(d,c) {
    var me=this;
    Meta.ajax({
      url: me.url,
      method:'POST',
      headers:{'Content-Type':'application/json'},
      data:JSON.stringify(d),
      callbacks:c
    });
    return me;
  },

  /**
     <method name="push" type="this">
     <desc>Add a JSONRPCv2 request that will be sent once execute runs</desc>
     <param name="a" type="hash">Hash with the JSONRPCv2 request data. Format: {method:<required:method_name>, params:<optional:hash_or_array>, id:<optional:string or number>}</param>
     </method>
  */
  push:function(a) {
    var me=this;
    me.under('push',a);
    me.fire(a.method);
    return me;
  },

  /**
     <method name="execute" type="this">
     <desc>Merge all the JSONRPCv2 queries in the array and send them. Set the id to be the array index. Clears the requests array after sending the requests.</desc>
     </method>
  */
  execute:function() {
    var a=[],s,b,me=this;
    me.forEach(function(v,i){
      s={
        jsonrpc:'2.0',
        method:v.method
      };
      if(v['params'])s.params=v.params;
      if(v['callback'])s.id=i;
      a.push(s);
    });
    b=me._;
    me._=[];
    me.send(a,function(r){
      me.$(r.json()).forEach(function(v){
        b[v.id].callback(v);
      });
      b=null;
    });
    return me;
  }
  
});
