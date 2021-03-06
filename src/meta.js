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
   <function name="Meta" type="Meta">
   <param name="[o]" type="mixed">Object to use with the lib</param>
   <desc>
   Creates a new object or return an object to manage the given one
   </desc>
   <test>
   <![CDATA[
   var a=Meta();
   return 'extend' in a && '$super' in a;
   ]]>
   </test>
   </function>
*/
var Meta=global.Meta=function()
{
  // Get outside Meta
  function ateM(){return Meta;};
  
  /**
   * Try to guess pre-existent extensions or
   * If the Object is Meta, it creates a new Meta
   * and extend it to the Object given.
   * 
   * o - Object to expand
   */
  function getParent(o)
  {
    var a=Meta(),
    b=Meta.its(o,'function')?o:o.constructor,
    c=a.constructor,i;
    
    if(b)
      c.prototype=new b();
    
    for(i in o)
      if(o.hasOwnProperty(i))
        c.prototype[i]=o[i];
    
    return c;
  };

  /**
   * Create custom object
   */
  function getMe(o)
  {
    var parent;

    if(o!==undefined)
      parent=getParent(o);
    
    /**
       <class name="Meta">
       <desc>Meta object</desc>
     */
    function Meta(){
      // Constructor fix
      this.constructor=Meta;

      /**
       <method name="$new" type="this">
       <desc>Create a new object of the same type</desc>
       <test>
       <![CDATA[
       var a=Meta({a:1}),b;
       b=a.$new();
       return b.a==a.a;
       ]]>
       </test>
       </method>
       */
      this.$new=function(){return new Meta()};

      /**
       <public name="info" type="object">Stores information of the library</public>
       */
      this.info=info; // info is defined on meta.head.js

      /**
       <method name="extend" type="this">
       <param name="o" type="mixed">Function or Object that has the extensions</param>
       <param name="[conf]" type="object">Custom configuration for the extension {exclude:[string,...],params:[]}</param>
       <desc>Extends the Meta constructor</desc>
       <test>
       <![CDATA[
       var a=Meta();
       a.extend({o:function(q){return q;}});
       return 'o' in a && a.o(1)==1;
       ]]>
       </test>
       </method>
       */
      this.extend=function(o,conf)
      {
        var a=['$super','extend','info'];
        conf=conf||{};
        conf.exclude=conf.exclude?conf.exclude.concat(a):a;
        return ateM().inherit(this,o,conf);
      };
    };

    if(parent)
      Meta.prototype=new parent();

    /**
     <method name="$super" type="mixed">
     <param name="a" type="string">Name of the super method</param>
     <desc>Use the asked super method</desc>
     <test>
     <![CDATA[
     var a=Meta({o:function(q){return q;}}),t1,t2,t3,t4;
     t1='o' in a;
     t2=a.o(1)==1;
     
     a.extend({o:function(q){return q+1;}});
     
     t3=a.o(1)==2;
     t4=a.$super('o',1)==1;
     return t1 && t2 && t3 && t4;
     ]]>
     </test>
     </method>
     */
    Meta.prototype.$super=function(a)
    {
      if(!parent)
        return undefined;

      var f,
          g=this.$super, // cache original this.$super
          p=parent.prototype;

      /*
        Map the "parent.prototype.$super" method, to "this.$super",
        when the "parent" method is called, it's called as "this"
        if the method called uses "this.$super", it will expect the "parent.$super"
        thats why it has to be mapped.
       */
      this.$super=p.$super; // map "this.$super" to the "parent.$super"
      f=p[a].apply(this,ateM().args2array(arguments,1));
      this.$super=g; // restore this.$super
      return f;
    };
    
    return Meta;
  };
  /** </class> */

  /**
   * Initialize the object
   * object o - Object to expand
   * return Generated object
   */
  return function(o)
  {
    return new (getMe(o))();
  };
}();

/**
   <global name="Meta.extensions" type="object">Available extension list</global>
 */
Meta.extensions={};
