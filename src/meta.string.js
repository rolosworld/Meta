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
 <class name="Meta.string">
 <inherit>Meta.core</inherit>
 <desc>String extensions</desc>
*/
Meta.string=Meta(Meta.core).extend({
  _:'',

  /**
   <method name="$" type="Meta.string">
   <desc>Custom $, let it set a value.</desc>
   <param name="a" type="string">String to be managed</param>
   <test>
   <![CDATA[
     var a=Meta.string.$('foo'),t;
     t=a.get().length==3;
     a=Meta.string.$('');
     return t && a.get().length==0 && Meta.string.$().get().length==0;
   ]]>
   </test>
   </method>
   */
  $:function(a)
  {
    return this.$new().set(a||'');
  },

  /**
   <method name="set" type="this">
   <param name="a" type="mixed">Value to set. Tries to convert it to string.</param>
   <desc>Set the string</desc>
   <test>
   <![CDATA[
     return Meta.string.$().set('foo').get().length==3;
   ]]>
   </test>
   </method>
   */
  set:function(a)
  {
    return this.$super('set',''+a);
  },

  /**
   <method name="len" type="integer">
   <desc>Get the length of a string</desc>
   <test>
   <![CDATA[
     return Meta.string.$().set('foo').len()==3;
   ]]>
   </test>
   </method>
   */
  len:function()
  {
    return this.get().length;
  },

  /**
   <method name="dos2unix" type="this">
   <desc>Convert DOS format to Unix txt format</desc>
   <test>
   <![CDATA[
     return Meta.string.$("foo\r\n").dos2unix().get()=="foo\n";
   ]]>
   </test>
   </method>
   */
  dos2unix:function()
  {
    return this.replace(/\r\n|\r/g,"\n");
  },

  /**
   <method name="unix2dos" type="this">
   <desc>Convert Unix format to DOS txt format</desc>
   <test>
   <![CDATA[
     return Meta.string.$("foo\n").unix2dos().get()=="foo\r\n";
   ]]>
   </test>
   </method>
   */
  unix2dos:function()
  {
    return this.replace(/\n/g,"\r\n");
  },

  /**
   <method name="toCamelCase" type="string">
   <desc>Convert string to camel case format</desc>
   <param name="a" type="string">Delimiter</param>
   <test>
   <![CDATA[
     return Meta.string.$("foo-bar").toCamelCase('-')=="fooBar";
   ]]>
   </test>
   </method>
   */
  toCamelCase:function(a)
  {
    a=this.split(a);
    for(var i=1,j=a.length,k;i<j;i++)
    {
      k=a[i];
      a[i]=k.charAt(0).toUpperCase();
      a[i]+=k.substr(1);
    }

    return a.join('');
  },

  /**
   <method name="stripTags" type="this">
   <desc>Strip tags from string object</desc>
   <test>
   <![CDATA[
     return Meta.string.$("<b>foo</b>").stripTags().get()=="foo";
   ]]>
   </test>
   </method>
   */
  stripTags:function()
  {
    return this.replace(/<\/?[^>]+>/g,'');
  },

  /**
   <method name="escapeHTML" type="this">
   <desc>Tries to return an html friendly version of the string. Converts some special characters to their respective entities.</desc>
   <test>
   <![CDATA[
     return Meta.string.$("<b>&nbsp;foo</b>").escapeHTML().get()=="&lt;b&gt;&amp;nbsp;foo&lt;/b&gt;";
   ]]>
   </test>
   </method>
   */
  escapeHTML:function()
  {
    return this.
      replace(/&/g,'&amp;').
      replace(/</g,'&lt;').
      replace(/>/g,'&gt;').
      replace(/'/g,'&#39;').
      replace(/"/g,'&#34;');
  },

  /**
   <method name="unescapeHTML" type="this">
   <desc>
    Returns only the text content of the object. Converts the HTML entities into their respective characters.
    Uses HTML DOM, not compatible with XHTML.
   </desc>
   <test>
   <![CDATA[
    return Meta.string.$("&lt;b&gt;foo&lt;/b&gt;").unescapeHTML().get()=="<b>foo</b>";
   ]]>
   </test>
   </method>
   */
  unescapeHTML:function()
  {
    var div=document.createElement('div');
    div.innerHTML=this.stripTags().get(); // Not xhtml friendly
    return this.set(div.childNodes[0]?div.childNodes[0].nodeValue:'');
  },

  /**
   <method name="trim" type="this">
   <desc>trim a string</desc>
   <test>
   <![CDATA[
   return Meta.string.$(" foo ").trim().get()=="foo";
   ]]>
   </test>
   </method>
   */
  trim:function()
  {
    return this.replace(/^\s+|\s+$/g,"");
  },

  /**
   <method name="rtrim" type="this">
   <desc>right trim a string</desc>
   <test>
   <![CDATA[
   return Meta.string.$(" foo ").rtrim().get()==" foo";
   ]]>
   </test>
   </method>
   */
  rtrim:function()
  {
    return this.replace(/\s+$/,"");
  },

  /**
   <method name="ltrim" type="this">
   <desc>left trim a string</desc>
   <test>
   <![CDATA[
   return Meta.string.$(" foo ").ltrim().get()=="foo ";
   ]]>
   </test>
   </method>
   */
  ltrim:function()
  {
    return this.replace(/^\s+/,"");
  },

  /**
   <method name="insertAt" type="this">
   <desc>Insert string on position p</desc>
   <param name="p" type="integer">Position</param>
   <param name="c" type="string">String to be inserted</param>
   <test>
   <![CDATA[
   return Meta.string.$("foo").insertAt(3,'s').get()=="foos";
   ]]>
   </test>
   </method>
   */
  insertAt:function(p,c)
  {
    var a=this.get();
    return this.set(a.substr(0,p)+c+a.substr(p));
  },

  /**
   <method name="addSlashes" type="this">
   <desc>Add Slashes for single quote strings.</desc>
   <test>
   <![CDATA[
   return Meta.string.$("f'oo").addSlashes().get()=='f\\\'oo';
   ]]>
   </test>
   </method>
   */
  addSlashes:function()
  {
    return this.
      replace(/\\/g,"\\\\").
    //replace(/\"/g,"\\\"").
      replace(/\'/g,"\\'");
  },

  /**
   <method name="stripSlashes" type="this">
   <desc>Strip Slashes. For single quote strings.</desc>
   <test>
   <![CDATA[
   return Meta.string.$('f\\\\oo').stripSlashes().get()=='f\\oo';
   ]]>
   </test>
   </method>
   */
  stripSlashes:function()
  {
    return this.
      replace(/\\'/g,"'").
    //replace(/\\"/g,'"').
      replace(/\\\\/g,'\\');
  },

  /**
   <method name="nl2br" type="this">
   <desc>Convert new line character to <br/> string</desc>
   <test>
   <![CDATA[
     return Meta.string.$("foo\n").nl2br().get()=='foo<br/>';
   ]]>
   </test>
   </method>
   */
  nl2br:function()
  {
    return this.dos2unix().replace(/\n/g,"<br/>");
  },

  /**
   <method name="br2nl" type="this">
   <desc>Convert <br/> string to new line character</desc>
   <test>
   <![CDATA[
     return Meta.string.$("foo<br>").br2nl().get()=="foo\n";
   ]]>
   </test>
   </method>
  */
  br2nl:function()
  {
    return this.replace(/<br\s*\/?>/gi,"\n");
  },


  /**
   <method name="toInt" type="integer">
   <desc>Strip all non numeric characters from the string and returns it as an integer.</desc>
   <test>
   <![CDATA[
     return Meta.string.$("1a2b3").toInt()=="123";
   ]]>
   </test>
   </method>
  */
  toInt:function()
  {
    return parseInt(this.get().match(/\d/g).join(''),10);
  }
}).extend(function()
{
  var m=Meta.genProperties;
  // Generate shortcuts for wrapped methods
  m('replace,concat,substr,substring,slice,toUpperCase,toLowerCase',
    function(d){return function(){return this.set(this.wrap(d,arguments));};},
    this);

  // Returns value from method
  m('charAt,charCodeAt,indexOf,lastIndexOf,search,match,split,valueOf',
    function(d){return function(){return this.wrap(d,arguments);};},
    this);
});

/**
 <method name="replace" type="this">
 <desc>Replaces some characters with some other characters in all the strings.</desc>
 <param name="a" type="mixed">String value to find. Will be replaced. Can be a regexp.</param>
 <param name="b" type="string">String to insert.</param>
 </method>

 <method name="concat" type="string">
 <desc>Join two or more strings into the strings.</desc>
 <param name="..." type="string">One or more string objects to be joined to the strings.</param>
 </method>
 
 <method name="substr" type="this">
 <desc>Extracts a specified number of characters in a string, from a start index.</desc>
 <param name="a" type="integer">Index of where to start the extraction. Can be negative to start from the end.</param>
 <param name="[b]" type="integer">How many characters to extract.</param>
 </method>
 
 <method name="substring" type="this">
 <desc>Extracts the characters in a string between two specified indices.</desc>
 <param name="a" type="integer">Index of where to start the extraction. Starts at 0.</param>
 <param name="[b]" type="integer">Index of where to stop the extraction.</param>
 </method>
 
 <method name="slice" type="this">
 <desc>Extracts a part of the strings.</desc>
 <param name="a" type="integer">Index where to start the selection. Can be negative to start from the end.</param>
 <param name="[b]" type="integer">Index where to end the selection.</param>
 </method>
 
 <method name="toUpperCase" type="this">
 <desc>Sets the strings to uppercase letters.</desc>
 </method>
 
 <method name="toLowerCase" type="this">
 <desc>Sets the strings to lower letters.</desc>
 </method>

 <method name="charAt" type="string">
 <param name="a" type="integer">Index of the character to return.</param>
 <desc>Returns the character at a specified position.</desc>
 </method>
 
 <method name="charCodeAt" type="string">
 <param name="a" type="integer">Index of the character to return.</param>
 <desc>Returns the unicode of the character at a specified position.</desc>
 </method>
 
 <method name="indexOf" type="integer">
 <param name="a" type="string">String value to search for.</param>
 <param name="[b]" type="integer">Index of the character where to start the search.</param>
 <desc>Returns the position of the first occurrence of a specified string value in a string.</desc>
 </method>
 
 <method name="lastIndexOf" type="integer">
 <param name="a" type="string">String value to search for.</param>
 <param name="[b]" type="integer">Index of the character where to start the search.</param>
 <desc>Returns the position of the last occurrence of a specified string value in a string.</desc>
 </method>
 
 <method name="search" type="integer">
 <param name="a" type="mixed">String value to search for. Can be Regexp</param>
 <desc>Search a string for a specified value and returns its position.</desc>
 </method>
 
 <method name="match" type="string">
 <param name="a" type="mixed">String value to search for. Can be Regexp</param>
 <desc>Search a string for a specified value and return the value found.</desc>
 </method>
 
 <method name="split" type="array">
 <param name="a" type="mixed">String value where to split. Can be Regexp</param>
 <param name="[b]" type="integer">Number of splits to return.</param>
 <desc>Split a string into an array of strings.</desc>
 </method>
 
 <method name="valueOf" type="string">
 <desc>Returns the primitive value of the specified object.</desc>
 </method>

*/

/** </class> */
