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
 <function name="Meta.popup" type="void">
 <desc>
   Opens a popup window.

   Configuration object attributes:
     src    Optional. URL destination.
     name   Optional. Name to be given to the popup. Sould not have special chars.
     params Optional. Parameters to be passed to the window.open method.
     title  Optional. Title to use if no src is given, will use this. If not set will use the name (given or generated).
     write  Optional. Content to be writen if no src is given.
 </desc>
 <param name="[a]" type="object">Configuration object</param>
 <test>
 <![CDATA[
   var a=Meta.popup({title:'Test'});
   a.close();
   return true;
 ]]>
 </test>
 </function>
*/
Meta.popup=function(a)
{
  a=a||{};
  a.src=a.src||'';

  var w=w=window.open(a.src,
    a.name||(a.name='meta'+(new Date()).getTime()),
    a.params||'');

  if(a.src==''&&w&&w.document)
  {
    w.document.writeln(a.write||'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'+"\n"+
                                '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>'+(a.title||a.name)+'</title></head><body></body></html>');
    w.document.close();
  }

  // check if for some reason the window is not available (...popup blockers...)
  if(!w)
    w=null;

  return w;
};