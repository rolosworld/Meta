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
   <function name="Meta.assert" type="void">
   <desc>Checks the assertion and forwards it to callbacks.</desc>
   <param name="a" type="string">Message to forward to the callbacks</param>
   <param name="b" type="bool">Assertion</param>
   <test>
   <![CDATA[
     Meta.assert("true",true);
     return true;
   ]]>
   </test>
   </function>
*/
Meta.assert=function(a,b)
{
  var c=Meta.assert;
  if(c.log)
    Meta.log(a+' = '+b);

  if(b!==true&&b!==false)
    c.onfail('Unexpected value: '+b);

  if(!b)
    c.onfail(a);
  else
    c.onpass(a);
};

/**
<global name="Meta.assert.log" type="bool">Flag for logging assertions. Default false.</global>
*/
Meta.assert.log=false;

/**
<function name="Meta.assert.onfail" type="void">
<param name="a" type="string">Message passed to the assertion.</param>
<desc>Called if the assertion is false.</desc>
</function>
*/
Meta.assert.onfail=function(){};

/**
<function name="Meta.assert.onpass" type="void">
<param name="a" type="string">Message passed to the assertion.</param>
<desc>Called if the assertion is true.</desc>
</function>
*/
Meta.assert.onpass=function(){};
