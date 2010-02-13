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
   return 'extend' in a && 'under' in a;
   ]]>
   </test>
   </function>
*/
var Meta=window.Meta=function()
{
  /**
   * Try to guess pre-existent extensions or
   * If the Object is Meta, it creates a new Meta
   * and extend it to the Object given.
   * 
   * o - Object to expand
   */

  function getHim(o)
  {
    var a=Meta.its(o),
        b=Meta.extensions[a],
        c;

    if(b)o=Meta(b).extend({_:o});
    else if(a!='meta')
      {
        c=Meta();
        if(a=='function'||Meta.its(o,'object'))c.extend(o);
        else c.extend({_:o});
        o=c;
      }

    return o.constructor;
  };

  /**
   * Create custom object
   */
  function getMe(o)
  {
    var father;

    function hasVal(a,b)
    {
      var i=a.length;
      while(i--)if(a[i] === b)break;
      return i;
    };

    /**
       <class name="Meta">
       <desc>Meta object</desc>
     */
    function Meta(){};

    if(o!==undefined)father=getHim(o);
    if(father)
      {
        Meta.prototype=new father();
        Meta.prototype.constructor=Meta;
      }

    /**
       <public name="info" type="object">Stores information of the library</public>
     */
    Meta.prototype.info=info; // info is defined on meta.head.js

    /**
       <method name="under" type="mixed">
       <param name="a" type="string">Name of the under method</param>
       <desc>Use the asked under method</desc>
       <test>
       <![CDATA[
       var a=Meta({o:function(q){return q;}}),t1,t2,t3,t4;
       t1='o' in a;
       t2=a.o(1)==1;

       a.extend({o:function(q){return q+1;}});

       t3=a.o(1)==2;
       t4=a.under('o',1)==1;
       return t1 && t2 && t3 && t4;
       ]]>
       </test>
       </method>
     */
    Meta.prototype.under=function(a)
      {
        if(!father)return undefined;

        var d=[],
	    f,
            i,
            g=this.under, // cache original this.under
	    j=arguments.length;

        for(i=1;i<j;i++)
          d.push(arguments[i]);

        /*
          Map the father.prototype.under method, to this.under,
          when the father method is called, its called as this
          if the method uses this.under, it will expect the father.under
          thats why it has to be mapped.
         */
        this.under=father.prototype.under; // map the this.under, to the father.under
        f=father.prototype[a].apply(this,d);
        this.under=g; // restore this.under
        return f;
      };

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
    Meta.prototype.extend=function(o,conf)
    {
      var p=[],
          e=[],
          w=this.constructor.prototype,
          b={};

      if(conf)
        {
          e=conf.exclude||e;
          p=conf.params||p;
        }

      // if its a function, initialize it to get the object
      // we need the object to set pointers to the functions instead of copy them
      if(typeof o == 'function')
        {
	  o.apply(b,p);
	  o=b;
        }

      // import the object
      for(p in o)
        {
          if(p!='constructor'&&
             w!=o[p]&&
             hasVal(e,p)<0)w[p]=o[p];
        }

      return this;
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