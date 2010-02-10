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
   <function name="Meta.log" type="void">
   <desc>Opens a popup window where to show output</desc>
   <param name="a" type="string">Text to show on the log window</param>
   <test>
   <![CDATA[
   var a=Meta.log("Hello World!");
   a.close();
   return true;
   ]]>
   </test>
   </function>
*/
Meta.log=function()
{
  var logw=null,
  b=Meta.dom.bro(),
  c=Meta.string.bro(),
  d=Meta.dom.bro(),
  size=0,
  t;

  Meta.dom.addEvent('unload',window,function(){if(logw&&!logw.closed)logw.close();});

  return function(a)
  {
    // check if the window is open
    if(!logw||logw.closed)
      logw=Meta.popup({title:'Meta.log',params:'width=400,height=400,location=0,menubar=0,status=0,toolbar=0,directories=0,personalbar=0,resizable=1,scrollbars=1,dependent=1'});

    // check if for some reason the window is not available (...popup blockers...)
    if(!logw||!logw.document||!logw.document.body||logw.closed)
    {
      logw=null;
      return logw;
    }

    b.set(logw.document.body).doc(logw.document);
    b.append('<div style="border-bottom:1px solid #ccc;padding:4px;font-size:12px;font-family:arial;">'+c.set(a).trim().escapeHTML().nl2br().get()+'</div>');
    if(size>Meta.log.buff)d.set(b.get().firstChild).doc(b.doc()).remove();
    logw.scrollBy(0,b.dims().height);
    logw.focus();

    return logw;
  };
}();

/** <global name="Meta.log.buff" type="integer">Number of logs the window should store.</global> */
Meta.log.buff=100;
