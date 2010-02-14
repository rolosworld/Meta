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
 <class name="Meta.dom">
 <inherit>Meta.domevent</inherit>
 <extend>Meta.animation</extend>
 <desc>DOM extensions, elements</desc>
*/
Meta.dom=Meta(Meta.domevent);
Meta.dom.info.name="Meta.dom";
Meta.dom.extend(Meta.animation);
Meta.dom.extend(function()
{
  // Methods for glue method
  // a DOM
  // b Cloned DOM
  // c ParentNode
  var glues={
    before:function(a,b,c){if(c)c.insertBefore(b,a);},
    after:function(a,b,c){if(c)c.insertBefore(b,a.nextSibling);},
    replace:function(a,b,c){if(c)c.replaceChild(b,a);},
    prepend:function(a,b){a.insertBefore(b,a.firstChild||null);},
    append:function(a,b){a.appendChild(b);}
  },

  str=Meta.string.bro(),
  arr=Meta.array.bro(),
  sandbox,sbdiv;

  // Get div from sandbox, in case of XML
  function getSBDiv()
  {
    sandbox=Meta.sandbox();
    sbdiv=sandbox.eval('document.createElement("div");');
    return sbdiv;
  };


  // Try to fix the css property name converting it to JS style.
  function css2js(a)
  {
    // Special case
    if(a=='float')a=isIE?'styleFloat':'cssFloat';

    // try to convert css property names to JS css property names
    a=a.split('-');
    for(var i=1,j=a.length,k;i<j;i++)
    {
      k=a[i];
      a[i]=k.charAt(0).toUpperCase();
      a[i]+=k.substr(1);
    }

    return a.join('');
  };

  // check if option has a value, else use the option text as the value
  function optVal(a)
  {
    return (a.value!==null&&a.value!==undefined&&a.value.length>0)
      ?a.value
      :a.text;
  };

  return {
    _doc:document,

    /**
     <method name="bro" type="Meta.dom">
     <desc>Custom bro for Meta.dom</desc>
     <param name="[...]" type="mixed">Mixed data</param>
     <test>
     <![CDATA[
     var a=document.createElement('b');
     return Meta.dom.bro(a).get(0)==a;
     ]]>
     </test>
     </method>
     */
    bro:function()
    {
      var a=['bro'],
          b=arguments;

      if(!b.length)
        a.push(this.doc());
      else
        a=a.concat(Meta.obj2array(b));
      
      // Use bro from Meta.array
      return this.under.apply(this,a);
    },

    /**
     <method name="set" type="Meta.dom">
     <desc>Set the DOM or DOMS to be managed</desc>
     <param name="a" type="mixed">Mixed data. Can be an array of elements or a single element</param>
     <param name="[i]" type="integer">Index where to set the value</param>
     <test>
     <![CDATA[
     var a=document.createElement('b');
     return Meta.dom.bro().set(a).get(0)==a;
     ]]>
     </test>
     </method>
     */
    set:function(a,i)
    {
      a=a||this.doc();
      if(!Meta.its(i,'number')&&!Meta.its(a,'array'))
        a=[a];

      // Use set from Meta.core
      return this.under.apply(this,['set',a,i]);
    },

    /**
     <method name="doc" type="mixed">
     <param name="[x]" type="mixed">XML data if an XML should be created or a document object</param>
     <desc>Get|Set|Create the document of the current elements</desc>
     <test>
     <![CDATA[
     return !!1;
     ]]>
     </test>
     </method>
     */
    doc:function(x)
    {
      var a;

      // Get document
      if(!x)
        return (this._doc=this._doc||document);

      // If its not a string, it should be a document object
      if(!Meta.its(x,'string'))
      {
        this._doc=x.nodeType==9?x:x.ownerDocument?x.ownerDocument:document;
        return this;
      }

      // Create XML document
      if(isIE)
      {
        //this._ieXML=new ActiveXObject("Microsoft.XMLDOM");
        this._doc=new ActiveXObject("Msxml2.DOMDocument");
        this._doc.async=false;
        this._doc.loadXML(x);
      }
      else
        this._doc=(new DOMParser()).parseFromString(x,"text/xml");

      this.set(Meta.obj2array(this._doc.childNodes));
      return this;
    },

    /**
     <method name="select" type="this">
     <param name="a" type="string">CSS rules</param>
     <param name="[c]" type="mixed">Use offset, Bool if currently defined elements should be used or Element for using it instead.</param>
     <desc>Select elements from the given document, the offset element is the one defined in this.</desc>
     <test>
     <![CDATA[
     return Meta.dom.bro().select('body').get(0)==document.body;
     ]]>
     </test>
     </method>
     */
    select:function(a,c)
    {
      var me=this,
          b=[],
          s=Meta.select,
          i,
          j,
          v,
          w;

      if(a.nodeType)
      {
        me._=[a];
        return me;
      }

      else if(c)
      {
        if(c.nodeType)
          me._=[c];

        w=me._;
        j=w.length;
        for(i=0;i<j;i++)
          b=b.concat(s(a,w[i]));
      }

      else
        b=s(a,me.doc());

      me._=b;
      return me;
    },

    /**
     <method name="evalGlobal" type="this">
     <param name="a" type="string">Script string</param>
     <desc>Evaluates a given script string on the global context.</desc>
     </method>
     */
    evalGlobal:function(a)
    {
      var doc=this.doc(),
          script=doc.createElement('script'),
          head=doc.getElementsByTagName('head')[0]||doc.documentElement;

      script.type='text/javascript';

      if(isIE)
        script.text=a;
      else
        script.appendChild(doc.createTextNode(a));

      head.insertBefore(script,head.firstChild);
      head.removeChild(script);
      return this;
    },

    /**
     <method name="glue" type="this">
     <param name="e" type="mixed">Element, Array of elements or HTML string to be used.</param>
     <param name="[t]" type="string">
       Type of insertion, default is append.
       Types:
       before
       after
       prepend
       append
     </param>
     <desc>Insert the given element on the elements</desc>
     </method>
     */
    glue:function(e,t)
    {
      if(e=='')
        return this;

      var i,
          j,
          g,
          h,
          v,
          me=this,
          z=glues[t||'append'],
          y=me.son(),
          l,
          s=[],
          u=[],
          w;

      // Assume its an element
      if(e.nodeType)
        y._=[e];

      // Assume its a string
      else if(typeof e == 'string')
        y.create(e);

      // Assume its an array of elements
      else
        y._=e;

      // Create document fragment
      h=y._;
      j=h.length;
      g=me.doc().createDocumentFragment();
      for(i=0;i<j;i++)
      {
	w=h[i];

	// Get scripts
	if(w.nodeName.toLowerCase()=='script')
	  s.push(w);
	else if(w.nodeType==1)
	  s=s.concat(Meta.obj2array(w.getElementsByTagName('script')));

	g.appendChild(w);
      }

      // Process scripts
      j=s.length;
      for(i=0;i<j;i++)
      {
	w=s[i];
	if(!w.src)
	{
	  u.push(w.text||w.textContent||w.innerHTML||'');
	  w.parentNode.removeChild(w);
        }
      }
      u=u.join("\n");

      // glue it
      h=me._;
      j=h.length;
      for(i=0;i<j;i++)
      {
        v=h[i];
        z(v,i?g.cloneNode(true):g,v.parentNode);
        me.evalGlobal(u);
      }

      return me;
    },

    /**
     <method name="remove" type="this">
     <desc>Remove all elements from their parentNode.</desc>
     <test>
     <![CDATA[
     var a=document.createElement('div');
     a.id="test";
     document.body.appendChild(a);
     Meta.dom.bro(a).remove();
     return !document.getElementById('test');
     ]]>
     </test>
     </method>
     */
    remove:function()
    {
      var x=this._,
          i=x.length,
          v;

      while(i--)
      {
        v=x[i];

        if(v.parentNode)
          v.parentNode.removeChild(v);
      }

      return this;
    },

    /**
     <method name="create" type="this">
     <param name="e" type="string">Element to be created</param>
     <desc>Create the given HTML|XML into their respective DOM</desc>
     <test>
     <![CDATA[
     return Meta.dom.bro().create('<div>ok</div>').get(0).innerHTML=='ok';
     ]]>
     </test>
     </method>
     */
    create:function(e)
    {
      var d=this.doc().createElement('div'),
          a=[],
          b;

      // XML
      if(this.isXML(d))
      {
        b=sbdiv;
        if(!b)
          b=getSBDiv();

        b.innerHTML=e;
        Meta.dom.copyNodes(b.childNodes,d);
      }

      // HTML
      else
      {
        if(isIE)
        {
	  // Fix for single script tags in IE
	  d.innerHTML='<br>'+e;
	  d.removeChild(d.firstChild);
	}
	else
	  d.innerHTML=e;
      }

      while((b=d.firstChild))
        a.push(d.removeChild(b));

      return this.set(a);
    },

    /**
     <method name="prop" type="mixed">
     <param name="a" type="string">Property name</param>
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Get Element Property value, null if not found</desc>
     </method>
     */
    prop:function(a,i)
    {
      i=this.get(i||0);
      return i?(a in i?i[a]:null):i;
    },
  
    /**
     <method name="attr" type="mixed">
     <param name="a" type="string">Attribute name</param>
     <param name="[v]" type="mixed">Attribute value</param>
     <desc>Get|Set Element Attributes, null if not found</desc>
     <test>
     <![CDATA[
     var a=document.createElement('div'),t='',b=Meta.dom.bro(a);
     a.id='perro';
     t=b.attr('id')=='perro';
     b.attr('id','gato');
     return t && b.attr('id')=='gato';
     ]]>
     </test>
     </method>
     */
    attr:function(a,v)
    {
      var i,
          x=this._,
          l=x.length,
          b,
          w,
          c;
      
      if(!l)
        return null;
      
      b=x[0];
      c=b.attributes;
      
      if(!a)
        return c;

      // Set attribute
      if(v!==undefined)
      {
        i=l;
        while(i--)
	{
	  if(v===null&&x[i].removeAttribute)
	    x[i].removeAttribute(a);
	  else
	    x[i].setAttribute(a,v);
	}

        return this;
      }

      if(!c)
        return null;

      // Get attribute
      //return isIE?c[a].value:b.getAttribute(a);
      return b.getAttribute(a);
    },

    /**
     <method name="css" type="this">
     <param name="a" type="string">Style name</param>
     <param name="[v]" type="mixed">Style value</param>
     <desc>Get|Set Element CSS style</desc>
     <test>
     <![CDATA[
     var a=document.createElement('div'),t='',b=Meta.dom.bro(a);
     a.style.zIndex='1';
     t=b.css('zIndex')=='1';
     b.css('zIndex','2');
     return t && b.css('zIndex')=='2';
     ]]>
     </test>
     </method>
     */
    css:function(a,v)
    {
      var x=this._,
          w,
          i=x.length;

      a=css2js(a);
      if(v===undefined)
        return i?x[0].style[a]:null;
      
      while(i--)
        x[i].style[a]=v;
      
      return this;
    },

    /**
     <method name="style" type="string">
     <param name="s" type="string">Style</param>
     <param name="[i]" type="integer">Index, default 0</param>
     <desc>Try to get the element computed style</desc>
     </method>
     */
    style:function(s,i)
    {
      i=this.get(i||0);

      if(i)
      {
        s=css2js(s);
      
        i=window.getComputedStyle
          ? window.getComputedStyle(i,null).getPropertyValue(s)
          : i.currentStyle[s];
      }
    
      return i;
    },

    /**
     <method name="val" type="mixed">
     <param name="[v]" type="string">Value to set</param>
     <desc>
       Get|Set Element Value.
       If the element is a SELECT, return the selected OPTION value.
       If the SELECT has multiple attribute set, return an array with all the selected OPTION's values.
       If the OPTION has no value set, returns the text in the OPTION.
       Returns this or string
     </desc>
     <test>
     <![CDATA[
     var a=document.createElement('input'),t='',b=Meta.dom.bro(a);
     a.type="text";
     a.value='perro';
     t=b.val()=='perro';
     b.val('gato');
     t=t&&b.val()=='gato';
     b.create('<select><option>1</option><option selected="selected">2</option></select>');
     t=t&&b.val()=='2';
     b.val('1');
     return t&&b.val()=='1';
     ]]>
     </test>
     </method>
     */
    val:function(v)
    {
      var i,
          a=[],
          b,
          x=this._,
          w,
          j=x.length,
          o=Meta.indexOf;

      if(v!==undefined)
      {
        while(j--)
        {
          w=x[j];

	  if(w.nodeName=='SELECT')
          {
            if(!v.push)
	      v=[v];

	    b=w.options;
	    i=b.length;
            while(i--)
	    {
              a=b[i];
              a.selected=false;
	      if(o(v,optVal(a),1)>-1)
                a.selected=true;
	    }
          }
          else
            w.value=v;
        }

        return this;
      }

      if(!j)
        return null;

      v=x[0];
      
      if(v.nodeName!='SELECT')
        return v.value||null;
      
      if(!v.multiple)
        return optVal(v.options[v.selectedIndex]);

      v=v.options;
      for(i in v)
        if(v[i].selected)a.push(optVal(v[i]));
      return a;
    },

    /**
     <method name="outer" type="string">
     <param name="[a]" type="mixed">Index or Element. Default index is 0</param>
     <desc>Get the outerHTML of the given element</desc>
     <test>
     <![CDATA[
     return Meta.string.bro(Meta.dom.bro().create('<div>1</div>').outer().toLowerCase()).trim().get()=='<div>1</div>';
     ]]>
     </test>
     </method>
     */
    outer:function(a)
    {
      var x=this._,
          l=x.length,
          b,
          c,
          d;

      a=x[a||0];

      if(!a||!a.nodeType)
        return null;

      if(a.nodeType==3)
        return a.nodeValue;

      // not IE
      if(!isIE)
      {
        // XML
        if(this.isXML(a))
          return (new XMLSerializer()).serializeToString(a);

        // HTML
        b=this.doc().createElement('b');
        b.appendChild(a);
        return b.innerHTML;
      }

      // IE
      b=this.isXML(a)?'xml':'outerHTML';

      if(a.nodeType!=11)
        c=a[b];
      else
      {
	c=[];
	d=a.childNodes;
	l=d.length;
	while(l--)
	  c.push(d[l][b]);
	c.reverse();
	c=c.join('');
      }

      return c;
    },

    /**
     <method name="inner" type="mixed">
     <param name="[a]" type="mixed">Html or Element to insert</param>
     <param name="[w]" type="bool">Super cloned. Clones the elements in a unified way and tries to preserve the events.</param>
     <desc>Get|Set the innerHTML of the elements</desc>
     <test>
     <![CDATA[
     var a=Meta.dom.bro().create('<div>1</div>'),b;
     b=a.inner()=='1';
     a.inner('2');
     return b && a.inner()=='2';
     ]]>
     </test>
     </method>
     */
    inner:function(a,w)
    {
      var x=this._,
          b,
          s='',
          c,
          j,
          k=this.son(),
          l;

      if(a===undefined)
      {
        if(!x.length)
          return null;

        b=x[0];
        
        // HTML
        if(!this.isXML(b))
          return b.innerHTML;

        // XML
        c=b.childNodes;
        for(j=0,l=c.length;j<l;j++)
          s+=k.set(c[j]).outer();
        
        return s;
      }

      return this.empty().append(a,w);
    },

    /**
     <method name="text" type="mixed">
     <param name="[a]" type="string">Text</param>
     <desc>Get the text of the first element if no text is given else Set the text of the elements</desc>
     <test>
     <![CDATA[
     var a=Meta.dom.bro().create('<div><b>1</b></div>'),b,s=Meta.string.bro();
     b=a.text()=='1';
     a.text('<br>');
     return b && s.set(a.text()).unescapeHTML().get().toLowerCase()=='<br>';
     ]]>
     </test>
     </method>
     */
    text:function(a)
    {
      if(a===undefined)
      {
        var x=this._;
        if(!x.length)
          return null;

        a=x[0];
        return a.innerHTML?a.innerHTML.replace(/<\/?[^>]+>/gi,''):a.text||a.textContent;
      }

      return this.empty().append(this.doc().createTextNode(a));
    },

    /**
     <method name="elements" type="mixed">
     <desc>Get the current form elements or element</desc>
     <param name="[a]" type="string">Name of the element to return</param>
     </method>
     */
    elements:function(a)
    {
      var x=this._;
      if(!x.length)
        return null;

      var i,
          f=[],
          g=x[0];

      if(g.nodeName.toUpperCase()!='FORM')
        return null;

      g=g.elements;
      i=g.length;

      while(i--)
      {
        if(a===undefined)
          f.push(f[g[i].name]=g[i]);
        else if(g[i].name==a)
	  return g[i];
      }
      
      return a?null:f;
    },

    /**
     <method name="submit" type="this">
     <desc>Submit a form using ajax</desc>
     <param name="[a]" type="function">Callback function</param>
     </method>
     */
    submit:function(a)
    {
      var x=this._;
      
      if(!x.length)
        return this;

      a=a||function(){};
      
      var b=this.elements(),
          c=this.son(),
          d=[],
          i=0,
          e,
          f,
          p;

      for(;i<b.length;i++)
      {
        p=b[i];
        if(p.nodeName.toUpperCase()=="FIELDSET")
          continue;
        if(p.nodeName.toUpperCase()=="INPUT" &&
          (p.type.toLowerCase()=="checkbox" || p.type.toLowerCase()=="radio") &&
	  !p['checked'])
	    continue;

        e=c.set(p).val();
        f=encodeURIComponent(p.name,1)+'=';

        if(Meta.its(e,'array'))
          Meta.each(e,function(v)
	    {
	      d.push(f+encodeURIComponent((v===null||v===undefined)?'':v,1));
	    });
        else
          d.push(f+encodeURIComponent((e===null||e===undefined)?'':e,1));
      }

      Meta.ajax(x[0].action,a,d.join('&'));
      return this;
    },
      
    /**
     <method name="nodes" type="array">
     <param name="[i]" type="integer">Index of the element. Default is 0</param>
     <desc>Get the given element childNodes</desc>
     </method>
     */
    nodes:function(i)
    {
      var x=this._,
          a=[],
          j,
          c=x.length,
          l;

      i=i||0;
      
      if(c<=i)
        return null;

      c=x[i].childNodes;
      
      l=c.length;
      
      for(j=0;j<l;j++)
        if(c[j].nodeType==1)
          a.push(c[j]);

      return a;
    },

    /**
     <method name="empty" type="this">
     <desc>Empty all the elements</desc>
     <test>
     <![CDATA[
     var a=Meta.dom.bro().create('<div><b>1</b></div>');
     return a.empty().inner()=='';
     ]]>
     </test>
     </method>
     */
    empty:function()
    {
      var me=this,
          w,
          x=this._,
          i=x.length,
          xml=me.isXML(); // Asume all the nodes are of the same type as the doc

      while(i--)
      {
        w=x[i];
        if(!xml)
          w.innerHTML='';
        else while(w.firstChild)
	  w.removeChild(w.firstChild);
      }

      return this;
    },

    /**
     <method name="hasClass" type="bool">
     <desc>Verify if the element has the given class.</desc>
     <param name="a" type="string">Class name</param>
     <param name="[b]" type="integer">Index of the element. Default 0.</param>
     <test>
     <![CDATA[
     var a=Meta.dom.bro().create('<div class="perro gato"></div>');
     return a.hasClass('perro');
     ]]>
     </test>
     </method>
     */
    hasClass:function(a,b)
    {
      var x=this._,
          c=x.length;

      b=b||0;

      if(c<=b)
        return false;
      
      b=x[b];
      
      if(!b.className)
        return false;
      
      return (' '+b.className+' ').indexOf(' '+a+' ')>-1;
    },

    /**
     <method name="addClass" type="this">
     <desc>Add the given class to the elements.</desc>
     <param name="a" type="string">Class name</param>
     <test>
     <![CDATA[
     var a=Meta.dom.bro().create('<div class="perro gato"></div>'),b;
     b=!a.hasClass('yo');
     a.addClass('yo');
     return b&&a.hasClass('yo');
     ]]>
     </test>
     </method>
     */
    addClass:function(a)
    {
      var x=this._,
          i=x.length,
          v,
          z=str,//Meta.string.bro(),
          y=arr;//Meta.array.bro();
      
      while(i--)
      {
        v=x[i];
        if(v.className)
        {
          v.className=z.set(y.set(v.className.split(' ')).
            insert(a).
            unique().
            get().
            join(' ')).
            trim().
            get();
        }
      }

      return this;
    },

    /**
     <method name="rmClass" type="this">
     <desc>Removes the given class from the elements.</desc>
     <param name="a" type="string">Class name</param>
     <test>
     <![CDATA[
     var a=Meta.dom.bro().create('<div class="perro gato"></div>'),b;
     b=a.hasClass('gato');
     a.rmClass('gato');
     return b&&!a.hasClass('gato');
     ]]>
     </test>
     </method>
     */
    rmClass:function(a)
    {
      var x=this._,
          i=x.length,
          v,
          z=str,
          y=arr,
          d,c;

      while(i--)
      {
        v=x[i];
        if(v.className)
        {
          d=y.set(v.className.split(' ')).unique();
	  c=d.indexOf(a);
	  if(c>-1)
	    v.className=z.set(d.splice(c,1).get().join(' ')).trim().get();
        }
      }

      return this;
    },

    /**
     <method name="dims" type="object">
     <param name="[i]" type="integer">Index, default 0</param>
     <desc>Try to get the element dimensions. {top,left,width,height}</desc>
     </method>
     */
    dims:function(i)
    {
      i=this.get(i||0);
      if(i)
      {
        var l=i.offsetLeft||0,
            t=i.offsetTop||0,
            w=i.offsetWidth||0,
            h=i.offsetHeight||0;
        
        while((i=i.offsetParent))
        {
          l+=i.offsetLeft-i.scrollLeft+(i.clientLeft?i.clientLeft:0);
          t+=i.offsetTop-i.scrollTop+(i.clientTop?i.clientTop:0);
        }

        i={left:l,top:t,width:w,height:h};
      }
    
      return i;
    },

    /**
     <method name="scrollDims" type="object">
     <param name="[i]" type="integer">Index, default 0</param>
     <desc>Try to get the element scroll dimensions. {top,left,width,height}</desc>
     </method>
     */
    scrollDims:function(i)
    {
      return (i=this.get(i||0))
        ?{left:i.scrollX||i.scrollLeft,top:i.scrollY||i.scrollTop,width:i.scrollWidth||0,height:i.scrollHeight||0}
        :i;
    },
  
    /**
     <method name="opacity" type="this">
     <param name="o" type="float">Percentage of opacity</param>
     <desc>Set the opacity of the objects</desc>
     </method>
     */
    opacity:function(o)
    {
      var s,
          p=Math.round(o*100);

      return this.
        css('MozOpacity',o).
        css('opacity',o).
        css('KHTMLOpacity',o).
        css('zoom',1).
        css('filter',"alpha(opacity="+p+")");
    },

    /**
     <method name="hide" type="this">
     <desc>Hide the element</desc>
     </method>
     */
    hide:function(){return this.css('display','none');},

    /**
     <method name="show" type="this">
     <param name="[a]" type="string">Default display property.</param>
     <desc>Shows the element with its default display</desc>
     </method>
     */
    show:function(a){return this.css('display',a||'');},

    /**
     <method name="parent" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the parentNode of the element.</desc>
     </method>
     */
    parent:function(i)
    {
      return this.prop('parentNode',i);
    },
      
    /**
     <method name="next" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the nextSibling of the element.</desc>
     </method>
     */
    next:function(i)
    {
      i=this.get(i||0);
      while(i&&(i=i.nextSibling)&&i.nodeType!=1){}
      return i;
    },

    /**
     <method name="prev" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the previousSibling of the element.</desc>
     </method>
     */
    prev:function(i)
    {
      i=this.get(i||0);
      while(i&&(i=i.previousSibling)&&i.nodeType!=1){}
      return i;
    },
      
    /**
     <method name="first" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the firstChild of the element.</desc>
     </method>
     */
    first:function(i)
    {
      i=this.prop('firstChild',i);
      while(i&&i.nodeType!=1)
        i=i.nextSibling;
      return i;
    },

    /**
     <method name="last" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the lastChild of the element.</desc>
     </method>
     */
    last:function(i)
    {
      i=this.prop('lastChild',i);
      while(i&&i.nodeType!=1)
        i=i.previousSibling;
      return i;
    },

    /**
     <method name="value" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the nodeValue of the element.</desc>
     </method>
     */
    value:function(i)
    {
      return this.prop('nodeValue',i);
    },
      
    /**
     <method name="type" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the nodeType of the element.</desc>
     </method>
     */
    type:function(i)
    {
      return this.prop('nodeType',i);
    },

    /**
     <method name="name" type="element">
     <param name="[i]" type="integer">Index of the element.</param>
     <desc>Returns the nodeName of the element.</desc>
     </method>
     */
    name:function(i)
    {
      return this.prop('nodeName',i);
    },

    /**
     <method name="isXML" type="bool">
     <param name="[a]" type="element">Element to be check if it belongs to an XML.</param>
     <desc>Checks if the given element or the current document is an XML.</desc>
     </method>
     */
    isXML:function(a)
    {
      if(!a)
        a=this.doc();

      a=a.nodeType==9?a:a.ownerDocument;

      return a.documentElement.nodeName!=='HTML';
    }

  };
}());

/**
 <method name="prepend" type="this">
 <param name="e" type="element">Element to be prepended</param>
 <desc>Insert the given element at the start of the elements</desc>
 </method>

 <method name="append" type="this">
 <param name="e" type="element">Element to be appended</param>
 <desc>Insert the given element at the end of the elements</desc>
 </method>

 <method name="before" type="this">
 <param name="e" type="element">Element to be inserted</param>
 <desc>Insert the given element before the elements</desc>
 </method>

 <method name="after" type="this">
 <param name="e" type="element">Element to be inserted</param>
 <desc>Insert the given element after the elements</desc>
 </method>

 <method name="replace" type="this">
 <param name="e" type="element">Element to be inserted</param>
 <desc>Replace the elements with the given one</desc>
 </method>
 */
Meta.dom.extend(function()
{
  // Generate shortcuts for child method
  Meta.genProperties('prepend,append,before,after,replace',
    function c(d){return function(e){return this.glue(e,d);};},
    this);
});

/**
 <method name="prependTo" type="this">
 <param name="e" type="element">Element to be prepended</param>
 <desc>Insert the given element at the start of the elements</desc>
 </method>

 <method name="appendTo" type="this">
 <param name="e" type="element">Element to be appended</param>
 <desc>Insert the given element at the end of the elements</desc>
 </method>

 <method name="insertBefore" type="this">
 <param name="e" type="element">Element to be inserted</param>
 <desc>Insert the given element before the elements</desc>
 </method>

 <method name="insertAfter" type="this">
 <param name="e" type="element">Element after wich the insertion will occour.</param>
 <desc>Insert the current elements after the given element</desc>
 </method>

 <method name="replaceIn" type="this">
 <param name="e" type="element">Element to replaced with.</param>
 <desc>Replace the given element with the actual one.</desc>
 </method>
 */
Meta.dom.extend(function()
{
  var map={
        prependTo:'prepend',
        appendTo:'append',
        insertBefore:'before',
        insertAfter:'after',
        replaceIn:'replace'
      };

  // Generate shortcuts for child method
  Meta.genProperties('prependTo,appendTo,insertBefore,insertAfter,replaceIn',
    function c(d)
    {
      return function(e)
        {
          var a=this._;
          return this.
            set(e).
	    glue(a,map[d]).
	    set(a);
        };
    },
    this);
});

/** </class> */

Meta.extensions.element=Meta.dom;

/**
 <function name="Meta.dom.copyNodes" type="element">
 <param name="src" type="array">Array of nodes to copy</param>
 <param name="dest" type="element">Destination node</param>
 <param name="[wid]" type="bool">Set ids for all elements</param>
 <param name="[n]" type="element">Element to return mapped version</param>
 <desc>Try to copy childNodes to another document</desc>
 </function>
 */
Meta.dom.copyNodes=function(src,dest,wid,n)
{
  var _doc=dest.ownerDocument?dest.ownerDocument:(dest.nodeType==9?dest:document),

  l=function(a,c)
  {
    var b,
        i=0,
        j=c.length,
        m;
    
    for(;i<j;i++)
    {
      if(c[i].nodeType==1)
        b=a.appendChild(k(c[i]));
      else if(c[i].nodeType==3)
	a.appendChild(_doc.createTextNode(c[i].nodeValue));

      if(n==c[i])n=b;
    }
  },

  k=function(a)
  {
    // Set the uniqueID here, if needed, so it gets cloned
    if(wid && a && !a.id && Meta.has(a,'uniqueID'))
      a.id=a.uniqueID;

    var e=Meta.dom.cloneTag(a);

    // copy childs
    l(e,a.childNodes);
    return e;
  };

  l(dest,src);
  return n;
};

/**
 <function name="Meta.dom.cloneTag" type="element">
 <desc>Copy the given element into a new single equal one.</desc>
 <param name="a" type="element">Element to be cloned</param>
 </function>
 */
Meta.dom.cloneTag=function(a,doc)
{
  doc=doc||(a.ownerDocument?a.ownerDocument:document);

  var b=doc.createElement(a.nodeName.toLowerCase()),
      attr,
      i;

  // copy attributes
  attr=a.attributes;
  i=attr.length;
  while(i--)
    b.setAttribute(attr[i].name,attr[i].value);

  // CSS?

  return b;
};

/**
 <function name="Meta.dom.cloneNode" type="element">
 <desc>Copy the given element into a new equal one.</desc>
 <param name="a" type="element">Element to be cloned</param>
 </function>
 */
Meta.dom.cloneNode=function(a,doc)
{
  doc=doc||(a.ownerDocument?a.ownerDocument:document);
  if(a.nodeType==3)
    return doc.createTextNode(a.nodeValue);

  var b=Meta.dom.cloneTag(a,doc);
  Meta.dom.copyNodes(a.childNodes,b);
  return b;
};

/**
 <function name="Meta.dom.ready" type="void">
 <desc>Run the given function just after the DOM is loaded</desc>
 <param name="b" type="function">Callback function</param>
 </function>
 */
Meta.dom.ready=function()
{
  var ready=0,
      a,
      t,
      ev=Meta.events.bro(),
      cb;

  // Sets the custom event ready, for the window object
  ev.extend({
    fireReady:function()
    {
      if(ready)
        return; // if ready!=0 this function already was executed!
      
      ready=1;
      this.fireEvent('ready',window);
      
      if(t)
        clearInterval(t);
    }
  });


  // Create callback
  cb=ev.callback('fireReady');

  // Set browsers just after DOM is loaded detection
  if(Meta.has(document,'addEventListener')) // Mozilla
      document.addEventListener("DOMContentLoaded",cb,false);
  else if(Meta.has(window,'ActiveXObject')) // IE
  {
    a=document.createElement('script');
    a.onreadystatechange=function()
    {
      if((/loaded|complete/).test(a.readyState))
      {
	cb();
	a.onreadystatechange=null;
      }
    };
    a.defer=true;
    a.src="javascript:void(0);";
    document.getElementsByTagName('HEAD')[0].appendChild(a);
  }
  else if((/Safari/i).test(navigator.userAgent)) // Safari
  {
    t=setInterval(function()
      {
	if((/loaded|complete/).test(document.readyState))
          cb();
      },10);
  }

  // Set the callback on window.onload in case this is called first or didn't find the browser
  Meta.dom.addEvent('load',window,cb);

  // Actual function
  return function(b)
  {
      if(ready)
        b();
      else
        ev.addEvent('ready',window,b);
  };
}();


/**
 <function name="Meta.dom.purge" type="void">
 <param name="d" type="element">Element to be purged</param>
 <desc>
 From: http://javascript.crockford.com/memory/leak.html
 
 Takes a reference to a DOM element as an argument.
 It loops through the element's (and childs) attributes.
 If it finds any functions, it nulls them out.
 This breaks the cycle, allowing memory to be reclaimed.
 The purge function is harmless on Mozilla and Opera.
 It is essential on IE.
 The purge function should be called before removing any element,
 either by the removeChild method, or by setting the innerHTML property.
 </desc>
 </function>
 */
Meta.dom.purge=function(d)
{
  if(!isIE&&!d.attributes)
    return;

  var a=d.attributes,
      i,
      n;

  if(a)
    for(i=a.length;i--;)
    {
      n=a[i].name;
      if(typeof d[n]==='function')
	d[n]=null;
    }

  a=d.childNodes;
  if(a)
    for(i=a.length;i--;)
      Meta.dom.purge(a[i]);
};
