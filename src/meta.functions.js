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

// *** Crockford invented this method ***
// http://javascript.crockford.com/
/**
 <function name="Meta.son" type="object">
 <param name="a" type="object">Object</param>
 <desc>Clone of the object</desc>
 <test>
 <![CDATA[
 var a={a:1};
 var b=Meta.son(a);
 return 'a' in b;
 ]]>
 </test>
 </function>
 */
Meta.son=function(a)
{
  function b(){};
  b.prototype=a;
  return new b();
};


/**
 <function name="Meta.extend" type="object">
 <param name="a" type="object">Object to be expanded.</param>
 <param name="b" type="object">Object that will be used to expand.</param>
 <param name="[c]" type="array">String array of properties to excluce.</param>
 <desc>Extend a given object with another object.</desc>
 <test>
 <![CDATA[
 var a={a:1};
 var b=Meta.extend(a,{b:1});
 return 'a' in b && 'b' in b;
 ]]>
 </test>
 </function>
 */
Meta.extend=function(a,b,c)
{
  c=c||[];
  // import the methods
  for(var i in b)
    // copy pointers of methods to local variables
    if(i!='constructor'&&a!=b[i]&&Meta.indexOf(c,i)<0)
      a[i]=b[i];
  return a;
};

/**
 <function name="Meta.inherit" type="object">
 <param name="a" type="object">Object that will inherit</param>
 <param name="b" type="object">Object that will be used inherit</param>
 <param name="[c]" type="object">Custom configuration for the extension {exclude:[string,...],params:[]}</param>
 <desc>Inherits a given object into another object</desc>
 <test>
 <![CDATA[
 var a=Meta();
 Meta.inherit(a,{o:function(q){return q;}});
 return 'o' in a && a.o(1)==1;
 ]]>
 </test>
 </function>
 */
Meta.inherit=function(a,b,c)
{
  var p=[],
      e=[],
      o={};

  if(c)
  {
    e=c.exclude||e;
    p=c.params||p;
  }

  // if its a function, initialize it to get the object
  // we need the object to set pointers to the functions instead of copy them
  if(typeof b == 'function')
  {
    b.apply(o,p);
    b=o;
  }

  a=a.constructor?a.constructor.prototype:a;
  return Meta.extend(a,b,e);
};


/**
 <function name="Meta.each" type="bool">
 <param name="a" type="array">Array to loop</param>
 <param name="f" type="function">Callback function, its called with this as the value and can accept index and value attributes, function(index,value)</param>
 <param name="[m]" type="bool">Method flag, default is numerical</param>
 <desc>
   Execute given function on each array value, if the call returns false it breaks the loop.
   Bool true if it doesn't break, else false
 </desc>
 <test>
 <![CDATA[
 var a=[1,1],t=[];
 Meta.each(a,function(v,i){t[i]=v==1;});
 return t[0] && t[1];
 ]]>
 </test>
 </function>
 */
Meta.each=function(a,f,m)
{
  var i,j;
  if(!m)
  {
    for(i=0,j=a.length;i<j;i++)
      if(f.call(a,a[i],i)===false)
        return false;
  }
  else
  {
    for(i in a)
      if(f.call(a,a[i],i)===false)
        return false;
  }
  return true;
};


/**
 <function name="Meta.its" type="string">
 <param name="o" type="Object"></param>
 <param name="[a]" type="string">Type you want to compare</param>
 <desc>
   Try to get the type of data of the variable as a string.
   Returns the data type.
   Posible types:<ul>
   <li>string</li>
   <li>number</li>
   <li>function</li>
   <li>object</li>
   <li>undefined</li>
   <li>null</li>
   <li>nan</li>
   <li>infinite</li>
   <li>-infinite</li>
   <li>boolean</li>
   <li>element</li>
   <li>array</li>
   <li>date</li>
   <li>regexp</li></ul>
 </desc>
 <test>
 <![CDATA[
   var a,b=function(){},c=new b();
   return Meta.its('','string') &&
   Meta.its(0,'number') &&
   Meta.its(b,'function') &&
   Meta.its({},'object') &&
   Meta.its(a,'undefined') &&
   Meta.its(null,'null') &&
   Meta.its(Number.NaN,'nan') &&
   Meta.its(Number.POSITIVE_INFINITY,'infinite') &&
   Meta.its(Number.NEGATIVE_INFINITY,'-infinite') &&
   Meta.its(false,'boolean') &&
   Meta.its(document.body,'element') &&
   Meta.its([],'array') &&
   Meta.its(c,'object') &&
   Meta.its(new Date(),'date') &&
   Meta.its(/a/,'regexp') &&

   Meta.its('')=='string' &&
   Meta.its(0)=='number' &&
   Meta.its(b)=='function' &&
   Meta.its({})=='object' &&
   Meta.its(a)=='undefined' &&
   Meta.its(null)=='null' &&
   Meta.its(Number.NaN)=='nan' &&
   Meta.its(Number.POSITIVE_INFINITY)=='infinite' &&
   Meta.its(Number.NEGATIVE_INFINITY)=='-infinite' &&
   Meta.its(false)=='boolean' &&
   Meta.its(document.body)=='element' &&
   Meta.its([])=='array' &&
   Meta.its(c)=='object' &&
   Meta.its(new Date())=='date' &&
   Meta.its(/a/)=='regexp';
   ]]>
 </test>
 </function>
 */
Meta.its=function(o,a)
{
  var t=typeof o;
  if(a==t)
    return true;

  if(t=='object'||t=='function')
  {
    if(!o)
      t='null';

    else if(o.nodeType)
      t='element';

    //http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    else
      t=Object.prototype.toString.call(o).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
  }
  else if(t=='number')
  {
    if(isNaN(o))
      t='nan';
    else if(!isFinite(o))
      t=o>0?'infinite':'-infinite';
  }

  if(t=="meta"&&
    Meta.has(o,'info')&&
    Meta.has(o.info,'name'))
      {
	if(a==t)
          return true;
	t=o.info.name;
      }

  if(a)
    return a==t;

  return t;
};

/**
 <function name="Meta.obj2array" type="array">
 <param name="a" type="object">Array to loop</param>
 <param name="c" type="bool">Flag to switch types of loop</param>
 <desc>Conver an object to an array</desc>
 <test>
 <![CDATA[
   var a={0:0,1:1,length:1},
   b=Meta.obj2array(a),t1,t2;
   t1=b.length==1;
   t2=b[0]==0;
   b=Meta.obj2array(a,1);
   return t1 && t2 && b.length==3 &&
     b[0]==0 &&
     b[1]==1 &&
     b[2]==1;
   ]]>
 </test>
 </function>
 */
Meta.obj2array=function(a,c)
{
  if(!c&&!isIE)
    return Array.prototype.slice.call(a);
  else
  {
    var b=[];
    Meta.each(a,function(v){b.push(v);},c);
    return b;
  }
};

/**
 <function name="Meta.indexOf" type="integer">
 <param name="a" type="array">Array to search</param>
 <param name="b" type="mixed">Value to search</param>
 <param name="[c]" type="bool">Not Strict comparison</param>
 <desc>
   Search an array for a given value index. Can do not strict comparison.
   -1 if not found else 0...
 </desc>
 <test>
 <![CDATA[
   var a=[0,1];
   return Meta.indexOf(a,2)<0 &&
          Meta.indexOf(a,1)==1 &&
          Meta.indexOf(a,"1")<0 &&
          Meta.indexOf(a,2,1)<0 &&
          Meta.indexOf(a,1,1)==1;
 ]]>
 </test>
 </function>
 */
Meta.indexOf=function(a,b,c)
{
  var i=a.length;
  while(i--)
    if(!c)
    {
      if(a[i] === b)
        break;
    }
    else if(a[i] == b)
      break;
  return i;
};

/**
 <function name="Meta.unique" type="array">
 <param name="a" type="array"></param>
 <desc>Remove duplicate values from an array</desc>
 <test>
 <![CDATA[
   var a=[0,0,1,1],
   b=Meta.unique(a);
   return b.length==2 && b[0]==0 && b[1]==1;
 ]]>
 </test>
 </function>
 */
Meta.unique=function(a)
{
  var b=[],i,k;
  for(i=0,k=a.length;i<k;i++)
    if(Meta.indexOf(b,a[i])<0)
      b.push(a[i]);
  return b;
};

/**
 <function name="Meta.has" type="bool">
 <param name="a" type="object"></param>
 <param name="b" type="string"></param>
 <desc>Test if the object has the given property. If the property has null as value, it will be considered as not defined. You can test global variables with Meta.has(window,'document') for example</desc>
 <test>
 <![CDATA[
   var a={a:1};
   return Meta.has(a,'a') && !Meta.has(a,'b');
 ]]>
 </test>
 </function>
 */
Meta.has=function(a,b)
{
  return a&&a[b]!==undefined&&a[b]!==null;
};

/**
 <function name="Meta.genProperties" type="void">
 <param name="d" type="string">CSV of the names to use</param>
 <param name="c" type="function">Propertie function filler</param>
 <param name="o" type="object">Object where to implement the methods</param>
 <desc>Apply multiple properties to an object, using a function that generates its value.</desc>
 <test>
 <![CDATA[
 var a={};
 Meta.genProperties('a,b',function(a){return a;},a);
 return 'a' in a && 'b' in a;
 ]]>
 </test>
 </function>
 */
Meta.genProperties=function(d,c,o)
{
  for(var i=0,a=d.split(','),b=a[0];i<a.length;b=a[++i])
    o[b]=c(b);
};

/**
 <function name="Meta.toggle" type="function">
 <param name="a" type="function">On Callback</param>
 <param name="b" type="function">Off Callback</param>
 <param name="[c]" type="bool">Sets the default status. Default is Off. true==On, false==Off</param>
 <desc>Returns a function that alternates calling the given callbacks.</desc>
 <test>
 <![CDATA[
 var a=Meta.toggle(function(){return 0;},function(){return 1;}),t1;
 t1=a()==0 && a()==1;

 a=Meta.toggle(function(){return 0;},function(){return 1;},1);
 return t1 && a()==1 && a()==0;
 ]]>
 </test>
 </function>
 */
Meta.toggle=function(a,b,c)
{
  c=c||false;
  return function()
  {
    var d=(c=!c)?a:b;
    return d.apply(this,arguments);
  };
};
