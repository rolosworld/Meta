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
   <function name="Meta.ajax" type="object">
   <param name="conf" type="object">
Hash with the following items:
   url
     required
     string URL
   callback
     optional
     Array of functions or a single function, if its an array,the array index is the state callback
   post
     optional
     string post
   async
     optional
     bool
   headers
     optional
     hash: {header_type:header_value,...}
   method
     optional
     Request method, either "POST" or "GET". Default is "GET"
</param>
   <desc>
   Ajax function. Returns the XMLHttpRequest object

   Ready States:
     0 uninitialized
     1 loading
     2 loaded
     3 interactive
     4 complete

   Important Status Codes:
     200 OK
     304 Not Modified
     400 Bad Request
     401 Unauthorized
     403 Forbidden
     404 Not Found
     408 Request Timeout
     500 Internal Server Error
     503 Service Unavailable

     You can pass a single callback, which will be called when the ReadyState is 4.
     Or you can pass an array of callbacks in which each callback will be called by using the ReadyState as the index of the array.

     Pass to the callbacks an object with the given methods:
      status - Returns the returned status
      text   - Returns the responseText
      json   - Returns the evaluated responseText
      xml    - Returns the responseXML
   </desc>
   <test>
   <![CDATA[
   // States callbacks
   var t=[],callbacks=[
       function(a){t.push(true);}, // Uninitialized
       function(a){t.push(true);}, // Loading
       function(a){t.push(true);}, // Loaded
       function(a){t.push(true);}, // Interactive
       function(a){t.push(parseInt(a.text(),10)==1);}  // Complete
   ];

   Meta.ajax({url:'ajax_test.txt',callbacks:function(a){t.push(parseInt(a.text(),10)==1);},async:false});
   Meta.ajax({url:'ajax_test.txt',callbacks:callbacks,async:false});

   Meta.ajax({url:'ajax_test.txt',callbacks:function(b){t.push(parseInt(b.text(),10)==1);}});
   Meta.ajax({url:'ajax_test.txt',callbacks:callbacks});

   for(var i=0; i < t.length; i++)
     if(!t[i])
       return false;

   return true;
   ]]>
   </test>
   </function>
*/
Meta.ajax=function(conf)
{
  var method,headers;
  if(conf['post'])
  {
    method='POST';
    headers={"Content-type":"application/x-www-form-urlencoded"};
  }

  var callbacks=conf['callbacks'],
  async=conf['async']===undefined?Meta.ajax.async:conf.async;

  method=conf['method']?conf.method:method;
  headers=conf['headers']?conf.headers:headers;

  var http=isIE
    ? new ActiveXObject("Microsoft.XMLHTTP")
    : new XMLHttpRequest(),

  h={
    status:function(){return http.status;},
      text:function(){return http.responseText;},
      json:function(){return eval('('+(h.text()||'null')+')');},
       xml:function(){return http.responseXML;}
  },
  cbIsArray=Meta.its(callbacks,'array');

  http.open(method||'GET',conf.url, async);

  function onReady()
  {
    if(!callbacks)return;
    var s=http.readyState;
    if(!cbIsArray && s==4)callbacks.call(h,h);
    else if(callbacks[s])callbacks[s].call(h,h);
  };

  if(async)
    http.onreadystatechange=onReady;

  if(headers)
  {
    for(var i in headers)
    {
      http.setRequestHeader(i,headers[i]);
    }
  }
  //http.setRequestHeader("Content-length", post.length);
  http.send(conf['post']);

  if(!async)
    onReady();

  return http;
};

/** <global name="Meta.ajax.async" type="bool">Default async to use</global> */
Meta.ajax.async=true;
