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

// *** Dean Edwards discovered this ***
// http://dean.edwards.name/weblog/2006/11/sandbox/
/**
<function name="Meta.sandbox" type="object">
<desc>Returns a sandbox object</desc>
</function>
*/
/**
   <class name="Meta.sandbox">
   <desc>Sandbox object</desc>
 */
Meta.sandbox=function()
{
  // create an <iframe>
  var f1=document.createElement("iframe"),doc,f2;
  f1.style.display = "none";
  document.body.appendChild(f1);

  // write a script into the <iframe> and create the sandbox
  f2=frames[frames.length - 1];
  doc=f2.document;
  doc.writeln('<script>window.sandbox=window.ActiveXObject?this:{eval:function(s){return eval(s)}};</script>');
  doc.close();

  return {
    /**
    <method name="eval" type="mixed">
    <param name="a" type="string">JS program to evaluate.</param>
    <desc>Evaluates a JS program in a sandbox.</desc>
    </method>
    */
    eval:function(a){return f2.sandbox.eval(a);},

    /**
    <method name="include" type="void">
    <param name="a" type="string">Script to include in the sandbox.</param>
    <desc>Includes new scripts into the sandbox.</desc>
    </method>
    */
    include:function(a)
    {
      var b=doc.createElement('script');
      b.src=a;
      doc.body.appendChild(b);
    }
  };
};
/** </class> */
