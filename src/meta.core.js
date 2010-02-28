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
   <class name="Meta.core">
   <inherit>Meta</inherit>
   <desc>Core extension</desc>
 */
Meta.core=Meta().extend({
  /**
   <public name="_" type="array">Internal variable where the data is stored.</public>
   */
  _:null,

  /**
   <method name="$" type="Meta.core">
   <desc>Returns a new clone of the object. Set the passed value to the object if any is given.</desc>
   <param name="a" type="mixed">Values to set</param>
   <test>
   <![CDATA[
   var a=Meta.core.$();
   return '$' in a;
   ]]>
   </test>
   </method>
   */
  $:function(a)
  {
    return (new this.constructor()).set(a);
  },

  /**
   <method name="its" type="mixed">
   <param name="[a]" type="string">Type to compare with</param>
   <desc>Returns the data type of the object or bool</desc>
   <test>
   <![CDATA[
   var a=Meta.core.$();
   a.set("abc");
   return a.its()=='string' && a.its('string');
   ]]>
   </test>
   </method>
   */
  its:function(a)
  {
    return Meta.its(this._,a);
  },

  /**
   <method name="get" type="mixed">
   <desc>Get the value</desc>
   <test>
   <![CDATA[
   var a=Meta.core.$();
   return a.get()==null;
   ]]>
   </test>
   </method>
   */
  get:function()
  {
    return this._;
  },

  /**
   <method name="set" type="this">
   <param name="a" type="mixed">Value to set</param>
   <desc>Set the value</desc>
   <test>
   <![CDATA[
   var a=Meta.core.$();
   a.set(1);
   return a.get()==1;
   ]]>
   </test>
   </method>
   */
  set:function(a)
  {
    this._=a;
    return this;
  },

  /**
   <method name="wrap" type="array">
   <param name="b" type="string">Method name</param>
   <param name="c" type="array">arguments</param>
   <desc>
   Wrap a method to one owned by the data, executes it and returns the value.
   </desc>
   <test>
   <![CDATA[
   var a=Meta.core.$();
   a.set("abc");
   return a.wrap('charAt',[1])=='b';
   ]]>
   </test>
   </method>
   */
  wrap:function(b,c)
  {
    return this._[b].apply(this._,c);
  },

  /**
   <method name="copy" type="this">
   <desc>Get a copy of the current Meta</desc>
   <test>
   <![CDATA[
   var a=Meta.core.$(),b;
   a.set("abc");
   b=a.copy();
   return b.get()=='abc';
   ]]>
   </test>
   </method>
   */
  copy:function()
  {
    return this.$().set(this.get());
  },

  /**
   <method name="callback" type="function">
   <desc>Returna a function that executes the given method with the given arguments from the current object. It returns whatever the method returns.</desc>
   <param name="a" type="string">Method name</param>
   <param name="[...]" type="mixed">Arguments to be sent when the callback is called</param>
   <test>
   <![CDATA[
   var a=Meta.core.$(),b,t;
   b=a.callback("set","abc");
   t=a.get()==null;
   b();
   return t && a.get()=='abc';
   ]]>
   </test>
   </method>
   */
  callback:function(a)
  {
    var me=this,b=[],i=1,c=arguments;
    for(;i<c.length;i++)b.push(c[i]);
    return function(){return me[a].apply(me,b);};
  },

  /**
   <method name="getMe" type="this">
   <desc>Returna this. This method purpose is to be used with the callback function to pass this object.</desc>
   <test>
   <![CDATA[
   var a=Meta.core.$(),b=a.getMe();
   b.set('abc');
   return a.get()=='abc';
   ]]>
   </test>
   </method>
   */
  getMe:function(){return this;}
  
});
/** </class> */
