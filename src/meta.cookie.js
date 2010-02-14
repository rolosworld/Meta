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
   <class name="Meta.cookie">
   <desc>Cookie object</desc>
   <inherit>Meta.core</inherit>
*/
Meta.cookie=Meta(Meta.core);
Meta.cookie.extend({
  /**
   <method name="create" type="void">
   <desc>
   Creates cookie with name, value that expires on days and has path.

   Object attributes:
       value  String value to store in the cookie
       path   If not specified, defaults to the current path of the current document location.
       domain If not specified, defaults to the host portion of the current document location.
       max-age  max-age-in-seconds
       expires  date-in-toUTCString-format If not specified it wil expire at the end of session.
       secure  cookie to only be transmitted over secure protocol as https
   </desc>
   <param name="a" type="object">Contains the parameters to include on the cookie.</param>
   <test>
   <![CDATA[
   var a=Meta.cookie.bro('meta');
   a.create({value:'cookie'});
   return a.read()=='cookie';
   ]]>
   </test>
   </method>
   */
  create:function(a)
  {
    var c=this.get()+'='+a.value,
        i;

    for(i in a)
      if(i!='value')
	c+=';'+i+'='+a[i];

    document.cookie=c;
  },

  /**
   <method name="read" type="string">
   <desc>Returns the value of the given variable</desc>
   <test>
   <![CDATA[
   var a=Meta.cookie.bro('meta');
   a.create({value:'cookie'});
   return a.read()=='cookie';
   ]]>
   </test>
   </method>
   */
  read:function()
  {
    var ca=document.cookie.split(";"),
        c,
        i=ca.length;
    
    while(i--)
    {
      c=ca[i].replace(/^\s*|\s*$/g,"").split("=");
      if(c[0]==this.get())
        return decodeURIComponent(c[1]);
    }
    return null;
  },

  /**
   <method name="erase" type="void">
   <desc>Erase the variable given by this.obj</desc>
   <test>
   <![CDATA[
   var a=Meta.cookie.bro('meta'),t;
   a.create({value:'cookie'});
   t=a.read()=='cookie';
   a.erase();
   return t && a.read()==null;
   ]]>
   </test>
   </method>
   */
  erase:function()
  {
    var a=new Date();
    a.setDate(a.getDate()-9);
    this.create({value:'','max-age':0,expire:a.toUTCString()});
  }
});
/** </class> */
