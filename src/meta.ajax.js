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
   <param name="url" type="string">URL</param>
   <param name="[callback]" type="mixed">Array of functions or a single function, if its an array,the array index is the state callback</param>
   <param name="[post]" type="string">post</param>
   <param name="[async]" type="bool">async</param>
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

   Meta.ajax('ajax_test.txt',function(a){t.push(parseInt(a.text(),10)==1);},'',false);
   Meta.ajax('ajax_test.txt',callbacks,'',false);

   Meta.ajax('ajax_test.txt',function(b){t.push(parseInt(b.text(),10)==1);});
   Meta.ajax('ajax_test.txt',callbacks);

   for(var i=0; i < t.length; i++)
     if(!t[i])
       return false;

   return true;
   ]]>
   </test>
   </function>
*/
Meta.ajax=function(url, callbacks, post, async)
{
  post=post||'';
  async=async===undefined?Meta.ajax.async:async;

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

  http.open("POST", url, async);

  function onReady()
  {
    if(!callbacks)return;
    var s=http.readyState;
    if(!cbIsArray && s==4)callbacks.call(h,h);
    else if(callbacks[s])callbacks[s].call(h,h);
  };

  if(async)
    http.onreadystatechange=onReady;

  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //http.setRequestHeader("Content-length", post.length);
  http.send(post);

  if(!async)
    onReady();

  return http;
};

/** <global name="Meta.ajax.async" type="bool">Default async to use</global> */
Meta.ajax.async=true;
