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
   <class name="Meta.array">
   <desc>Array extensions</desc>
   <inherit>Meta.core</inherit>
 */
Meta.array=Meta(Meta.core);
Meta.array.extend(
{
  /**
   <method name="$" type="Meta.array">
   <desc>Custom $, let it set a value</desc>
   <param name="[...]" type="mixed">Mixed data</param>
   <test>
   <![CDATA[
   var a=Meta.array.$(1,2),t;
   t=a.get().length==2;
   a=Meta.array.$([1,2]);
   return t && a.get().length==2;
   ]]>
   </test>
   </method>
   */
  $:function()
  {
    var b=new this.constructor(),
        c;
    b.set([]);

    Meta.each(arguments,function(v)
	      {
		c=Meta.its(v);
		if(c=='array')
                  b.set(v);
		else if(c!='undefined')
                  b.push(v);
	      });

    return b;
  },

  /**
     <method name="get" type="mixed">
     <param name="[i]" type="integer">Index of the value to be returned. If none defined, return the array.</param>
     <desc>Get the values</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2]);
     return a.get(1)==2;
     ]]>
     </test>
     </method>
  */
  get:function(i)
  {
    var a=this.under('get');
    return Meta.its(i,'number')?a[i]:a;
  },

  /**
     <method name="set" type="this">
     <param name="a" type="mixed">Value to set, can be an array or a value and index</param>
     <param name="[i]" type="integer">Index for the value</param>
     <desc>Set the value</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$();
     a.set([1,2]);
     return a.get(1)==2;
     ]]>
     </test>
     </method>
  */
  set:function(a,i)
  {
    if(Meta.its(i,'number'))
      this.get()[i]=a;
    else
    {
      if(!Meta.its(a,'array'))
        a=[a];
      this.under('set',a);
    }
    return this;
  },


  /**
     <method name="indexOf" type="integer">
     <desc>Returns the index of the given item's first occurrence.Returns -1 if not found. Makes strict comparison only.</desc>
     <param name="a" type="mixed">Value been searched</param>
     <param name="[b]" type="integer">Starting index</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2]);
     return a.indexOf(2)==1;
     ]]>
     </test>
     </method>
  */
  indexOf:function(a,b)
  {
    var d=this.get(),
        e=d.length;

    for(b=b||0;b<e;b++)
      if(d[b]===a)
        return b;
    
    return -1;
  },

  /**
     <method name="lastIndexOf" type="integer">
     <desc>Returns the index of the given item's last occurrence. </desc>
     <param name="a" type="mixed">Value been searched</param>
     <param name="[b]" type="integer">Starting index</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2]);
     return a.lastIndexOf(2)==1;
     ]]>
     </test>
     </method>
  */
  lastIndexOf:function(a,b)
  {
    var d=this.get(),
        c=b+1||d.length;

    while(c--)
      if(d[c]===a)
        break;
    
    return c;
  },

  /**
     <method name="some" type="bool">
     <desc>
     Runs a function on items in the array while that function
     returns false. It returns true if the function returns
     true for any item it could visit.
     </desc>
     <param name="a" type="function">Callback</param>
     <param name="[b]" type="object">Object</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2]);
     return a.some(function(a){return a==2;});
     ]]>
     </test>
     </method>
  */
  some:function(a,b)
  {
    b=b||this;
    var d=this.get();
    return !Meta.each(d,function(v,i)
		      {
			if(a.call(b, v, i, d))
                          return false;
		      });
  },

  /**
     <method name="every" type="bool">
     <desc>
     Runs a function on items in the array while that function is
     returning true. It returns true if the function returns true
     for every item it could visit.
     </desc>
     <param name="a" type="function">Callback</param>
     <param name="[b]" type="object">Object</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2]);
     return a.some(function(a){return a==1||a==2;});
     ]]>
     </test>
     </method>
  */
  every:function(a,b)
  {
    b=b||this;
    var d=this.get();
    return Meta.each(d,function(v,i)
                     {
                       if(!a.call(b, v, i, d))
                         return false;
                     });
  },

  /**
     <method name="filter" type="array">
     <desc>
     Runs a function on every item in the array and returns an
     array of all items for which the function returns true.
     </desc>
     <param name="a" type="function">Callback</param>
     <param name="[b]" type="object">Object</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2,3]);
     return a.filter(function(a){return a>1;}).toString()=='2,3';
     ]]>
     </test>
     </method>
  */
  filter:function(a,b)
  {
    b=b||this;
    var d=[],
        e=this.get();
    
    Meta.each(e,function(v,i)
              {
                if(a.call(b, v, i, e))
                  d.push(v);
              });
    return d;
  },

  /**
     <method name="forEach" type="this">
     <desc>Runs a function on every item in the array.</desc>
     <param name="a" type="function">Callback</param>
     <param name="[b]" type="object">Object</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2,3]),b=0;
     a.forEach(function(v){b+=v;});
     return b==6;
     ]]>
     </test>
     </method>
  */
  forEach:function(a,b)
  {
    b=b||this;
    var i,
        j,
        c=this.get();

    Meta.each(c,function(v,i)
	      {
		// object, value, index, array
		a.call(b, v, i, c);
	      });
    return this;
  },

  /**
     <method name="map" type="array">
     <desc>
     Runs a function on every item in the array and returns
     the results in an array.
     </desc>
     <param name="a" type="function">Callback</param>
     <param name="[b]" type="object">Object</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2,3]),b;
     b=a.map(function(v){return v+1;});
     return b.toString()=='2,3,4';
     ]]>
     </test>
     </method>
  */
  map:function(a,b)
  {
    b=b||this;
    var d=[],
        e=this.get();

    Meta.each(e,function(v,i)
              {
                d.push(a.call(b, v, i, e));
              });
    return d;
  },

  /**
     <method name="numSort" type="this">
     <desc>Sort array by numbers</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$([3,2,1]);
     a.numSort();
     return a.get().toString()=='1,2,3';
     ]]>
     </test>
     </method>
  */
  numSort:function()
  {
    return this.sort(function(a,b)
      {
        return a-b;
      });
  },

  /**
     <method name="insert" type="this">
     <desc>Insert a new value in the given index</desc>
     <param name="v" type="mixed">Value</param>
     <param name="[i]" type="integer">Index</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,3]);
     a.insert(2,1);
     return a.get().toString()=='1,2,3';
     ]]>
     </test>
     </method>
  */
  insert:function(v,i)
  {
    if(i==undefined)
      this.push(v);
    else
      this.splice(i,0,v);
    return this;
  },

  /**
     <method name="drop" type="this">
     <desc>Remove array items from the given index and length</desc>
     <param name="a" type="integer">Index</param>
     <param name="[b]" type="integer">Length to be removed</param>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,2,3]);
     a.drop(1);
     return a.get().toString()=='1,3';
     ]]>
     </test>
     </method>
  */
  drop:function(a,b)
  {
    return this.splice(a,b||1);
  },

  /**
     <method name="unique" type="this">
     <desc>Remove duplicates</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,1,2]);
     a.unique();
     return a.get().toString()=='1,2';
     ]]>
     </test>
     </method>
  */
  unique:function()
  {
    return this.set(Meta.unique(this.get()));
  },

  /**
     <method name="len" type="integer">
     <desc>Get the given array length</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,1,2]);
     return a.len()==3;
     ]]>
     </test>
     </method>
  */
  len:function()
  {
    return this.get().length;
  },

  /**
     <method name="reduce" type="integer">
     <param name="fn" type="function">Callback to execute on each value in the array.</param>
     <param name="[b]" type="object">Object to use as the first argument to the first call of the callback.</param>
     <desc>Apply a function simultaneously against two values of the array (from left-to-right) as to reduce it to a single value.</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,4,5,2,3]);
     return a.reduce(function(a,b){return a-b;})==-13 && a.reduce(function(a,b){return a>b?a:b;},7)==7;
     ]]>
     </test>
     </method>
  */
  reduce:function(a,b)
  {
    var c=this.len(),
        i=0,
        _=this.get();

    for(b=b||_[i++];i<c;i++)
      b=a.call(this,b,_[i],i,_);

    return b;
  },

  /**
     <method name="reduceRight" type="integer">
     <param name="fn" type="function">Callback to execute on each value in the array.</param>
     <param name="[b]" type="object">Object to use as the first argument to the first call of the callback.</param>
     <desc>Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.</desc>
     <test>
     <![CDATA[
     var a=Meta.array.$([1,4,5,2,3]);
     return a.reduceRight(function(a,b){return a-b;})==-9 &&
            a.reduceRight(function(a,b){return a>b?a:b;},7)==7;
     ]]>
     </test>
     </method>
  */
  reduceRight:function(a,b)
  {
    var c=this.len(),
        i=c-1,
        _=this.get();

    if(c<1&&!b)
      return undefined;

    c=b||_[i--];

    for(;i>=0;i--)
      c=a.call(this,c,_[i],i,_);

    return c;
  },

  /**
     <method name="shuffle" type="this">
     <desc>Shuffle the array values randomly.</desc>
     </method>
  */
  shuffle:function()
  {
    var a=this.get(),
        b=a.length,
        c=b-1,
        d,
        e;
    
    while(b--)
      {
	d=Math.round(Math.random()*c);
	e=a[b];
	a[b]=a[d];
	a[d]=e;
      }

    return this;
  }

});

/**
 <method name="push" type="this">
 <desc>Add the value on the arrays</desc>
 <param name="..." type="mixed">Values to push</param>
 <test>
 <![CDATA[
 var a=Meta.array.$();
 a.push(1);
 return a.get(0)==1;
 ]]>
 </test>
 </method>

 <method name="sort" type="this">
 <desc>Sort the array</desc>
 <param name="[a]" type="function">Sort function</param>
 <test>
 <![CDATA[
 var a=Meta.array.$(['c','a','b']);
 a.sort();
 return a.get(0)=='a' && a.get(1)=='b' && a.get(2)=='c';
 ]]>
 </test>
 </method>

 <method name="splice" type="this">
 <desc>Remove and add new elements to an array</desc>
 <param name="i" type="integer">Index</param>
 <param name="a" type="integer">How many</param>
 <param name="[...]" type="mixed">Optional elements</param>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']);
 a.splice(1,1,'z');
 return a.get(0)=='a' && a.get(1)=='z' && a.get(2)=='c';
 ]]>
 </test>
 </method>

 <method name="unshift" type="this">
 <desc>Adds one or more elements to the beginning of an array</desc>
 <param name="[...]" type="mixed">Optional elements</param>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']);
 a.unshift('z');
 return a.get(0)=='z' && a.get(1)=='a' && a.get(2)=='b' && a.get(3)=='c';
 ]]>
 </test>
 </method>

 <method name="reverse" type="this">
 <desc>Shift a value from the given array or all the arrays</desc>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']);
 a.reverse();
 return a.get(0)=='c' && a.get(1)=='b' && a.get(2)=='a';
 ]]>
 </test>
 </method>

 <method name="pop" type="mixed">
 <desc>Pop a value from the given array</desc>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']),b;
 b=a.pop();
 return b=='c' && a.get(0)=='a' && a.get(1)=='b';
 ]]>
 </test>
 </method>

 <method name="shift" type="mixed">
 <desc>Shift a value from the given array</desc>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']),b;
 b=a.shift();
 return b=='a' && a.get(0)=='b' && a.get(1)=='c';
 ]]>
 </test>
 </method>

 <method name="concat" type="this">
 <desc>Add the value on the arrays</desc>
 <param name="..." type="array">arrays to be concat</param>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b']);
 a.concat(['c']);
 return a.get(0)=='a' && a.get(1)=='b' && a.get(2)=='c';
 ]]>
 </test>
 </method>

 <method name="slice" type="this">
 <desc>Set selected elements</desc>
 <param name="a" type="integer">Start</param>
 <param name="[b]" type="integer">End</param>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']);
 a.slice(1,2);
 return a.get(0)=='b';
 ]]>
 </test>
 </method>

 <method name="join" type="string">
 <desc>Join the values of the array and return a string</desc>
 <param name="a" type="string">Separator</param>
 <test>
 <![CDATA[
 var a=Meta.array.$(['a','b','c']),b;
 b=a.join('');
 return b=='abc';
 ]]>
 </test>
 </method>
 */
Meta.array.extend(function()
{
  var m=Meta.genProperties;

  // Returns this without set
  m('push,sort,splice,unshift,reverse',
    function(d)
    {
      return function()
      {
	this.wrap(d,arguments);
	return this;
      };
    },
    this);

  // Returns value from method
  m('pop,shift,join',
    function(d){return function(){return this.wrap(d,arguments);};},
    this);

  // Returns this after set
  m('concat,slice',
    function(d){return function(){return this.set(this.wrap(d,arguments));};},
    this);
});

Meta.extensions.Array=Meta.array;
/** </class> */
