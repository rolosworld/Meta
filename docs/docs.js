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
/* Global demo */
/** <global name="xml" type="object">Variable for debugging the xml document</global> */
// var xml;

/* Function demo */
/**
  <function name="loadDocs" type="void">
  <param name="a" type="object">Meta.ajax.response</param>
  <param name="b" type="object">test param</param>
  <desc>Load the XML documentation of the given JS</desc>
  </function>
*/
// function loadDocs(a){};

/**
  <class name="Meta.dummy">
  <inherit>documenter</inherit>
  <desc>Dummy class</desc>
  </class>
 */

/* Class+Public+Methods demo*/
/**
  <class name="documenter">
  <inherit>Meta</inherit>
  <inherit>Meta.core</inherit>
  <inherit>Meta.dummy</inherit>
  <extend>Meta.dummy</extend>
  <desc>
    Create the documentation.

    Tags available:

    &lt;global name="name" type="data type"&gt;Description&lt;/global&gt;

    ... Multiple Globals ...

    &lt;function name="name" type="return data type"&gt;
    &lt;param name="param name" type="data type"&gt;Param description&lt;/param&gt;
    ... Multiple params ...
    &lt;desc&gt;Function description&lt;/desc&gt;
    &lt;/function&gt;

    ... Multiple Functions ...

    &lt;class name="name"&gt;
    &lt;inherit&gt;Inherited object&lt;/inherit&gt;
    ... Multiple Inherit ...
    &lt;extend&gt;Object used to extend the class&lt;/extend&gt;
    ... Multiple Extend ...
    &lt;desc&gt;Description&lt;/desc&gt;
    &lt;public name="public variable name" type="data type"&gt;Description&lt;/public&gt;
    ... Multiple Public ...
    &lt;method name="name" type="return data type"&gt;
    &lt;param name="param name" type="data type"&gt;Param description&lt;/param&gt;
    ... Multiple Params ...
    &lt;desc&gt;Method description&lt;/desc&gt;
    &lt;/method&gt;
    ... Multiple Methods ...
    &lt;/class&gt;
    ... Multiple Class ...

  </desc>
*/
function toggler(a,b)
{
  var c=Meta.dom.bro(b).select(a);
  function d(){c.slide('down');};
  function e(){c.slide('up');};
  c.slide('up');
  return Meta.toggle(d,e);
};

function testRun(a,b)
{
  if(Meta.assert.log)
  {
    Meta.log('----------'+a+'----------');
    Meta.log(b);
  }

  try{
    (function()
     {
       Meta.assert(a,sandbox.eval('(function(){'+b+'}())'));
     }());
  }catch(e)
  {
    Meta.log(a+': '+e+"\n\n"+b);
  }
};

function tester(a,b)
{
  Meta.assert.log=true;
  Meta.assert.onpass=function(){};
  Meta.assert.onfail=function(){};
  testRun(a,b);
};

var documenter=Meta(Meta.core);
documenter.extend(
{
  /** <public name="xmlMeta" type="Meta.dom">XML document</public> */
 xmlMeta:null,

    /** <public name="files" type="array">source files</public> */
    files:null,

    /** <public name="domList" type="Meta.dom">Element where to show the menu list</public> */
    domList:null,

    /** <public name="domOut" type="Meta.dom">Element where to show the content</public> */
    domOut:null,

    /** <public name="domTmp" type="Meta.dom">Temporary element hadler</public> */
    domTmp:Meta.dom.bro(),

    /**
       <method name="getParamDesc" type="string">
       <param name="v" type="element">Element with parameters</param>
       <desc>Return a string with the parameters description.</desc>
       </method>
    */
    getParamDesc:function(v)
    {
      var params=[],
        d=Meta.dom.bro(),
        e=Meta.dom.bro(),
	  f=Meta.string.bro();
      d.set(v).select('param')
        .forEach(function(v)
                 {
                   e.set(v);
                   f.set(e.inner()).trim().escapeHTML().nl2br();
                   params.push('<span class="type">'+e.attr('type')+'</span> <span class="param">'+e.attr('name')+'</span><div style="padding-left:40px;">'+f.get()+'</div>');
                 });
      return params.join('');
    },

    /**
       <method name="getTestSrc" type="string">
       <param name="v" type="element">Element with parameters</param>
       <desc>Return a string with the source of the test.</desc>
       </method>
    */
    getTestSrc:function(v)
    {
      var test='',
      d=Meta.dom.bro(),
      s=Meta.string.bro();
      d.set(v).select('test');
      if(d.len())
	  {
	    s.set(d.text()).escapeHTML();
	    test='<pre name="code" class="js:nocontrols">'+"\n\n"+s.get()+"\n\n"+'</pre><button onclick="return false;" name="tester" father="'+d.set(v).attr('name')+'" code="'+s.get()+'">Run Test</button>';
	  }
      return test;
    },

    /**
       <method name="getParamStr" type="string">
       <param name="v" type="element">Element with parameters</param>
       <desc>Return the parameters as a string to be used on functions</desc>
       </method>
    */
    getParamStr:function(v)
    {
      var params=[],
        d=Meta.dom.bro(),
        e=Meta.dom.bro(),
        f=Meta.string.bro();
      d.set(v).select('param')
        .forEach(function(v)
                 {
                   e.set(v);
                   f.set(e.inner()).trim().escapeHTML();
                   params.push('<span class="type">'+e.attr('type')+'</span> <span class="param" title="'+f.get()+'">'+e.attr('name')+'</span>');
                 });
      return params.join(', ');
    },

    /**
       <method name="getVarStr" type="string">
       <param name="v" type="element">Variable Element</param>
       <desc>Return the variable as a string</desc>
       </method>
    */
    getVarStr:function(v)
    {
	var c=Meta.dom.bro(v),
	    f='<div class="desc">'+Meta.string.bro(c.inner()).nl2br().get()+'</div>';
	return '<span class="type">'+c.attr('type')+'</span> '+'<span class="function">'+c.attr('name')+'</span> '+f;
    },

    /**
       <method name="getFunctionStr" type="string">
       <param name="v" type="element">Function Element</param>
       <desc>Return the function as a string</desc>
       </method>
    */
    getFunctionStr:function(v)
    {
      var c=Meta.dom.bro(v),
        type=c.attr('type')?c.attr('type'):'void',
	  f=Meta.string.bro(),pdesc;


      return '<div class="functionBox"><div class="functionLine"><span class="type">'+type+'</span>'+
	  ' <span class="function">'+c.attr('name')+'</span>( '+this.getParamStr(v)+' )</div>'+
	  '<div class="desc">'+this.getParamDesc(v)+'<br/>'+
	  f.set(c.set(v).select('desc').inner()).trim().nl2br().get()+'<br/><br/>'+
	  this.getTestSrc(v)+'</div></div>';
    },

    /**
       <method name="getClassStr" type="void">
       <param name="v" type="element">Function Element</param>
       <desc>Return the function as a string</desc>
       </method>
    */
    setClassInfo:function(v)
    {
      if(Meta.its(v)=='string')
        v=this.xmlMeta.set([]).select('doc>class[name="'+v+'"]').get(0);
      if(!this.xmlMeta.len())return;

      var s='',
        me=this,
        c=Meta.dom.bro(v),
        d=Meta.dom.bro(),
        f='<div class="desc">'+Meta.string.bro(Meta.dom.bro().set(v)
                                               .select('desc')
                                               .inner()).nl2br().get()+'</div>';

      s+='<h1>'+c.attr('name')+'</h1>'+f;

      // inherits
      s+='<h1>Inherits</h1>';
      c.set(v).select('inherit').forEach(function(e)
                                    {
                                      var t=d.set(e).inner();
                                      s+='<div class="inherit" onclick="documenter.setClassInfo(\''+t+'\');" style="cursor:pointer;">'+t+'</div>';
                                    });

      // extends
      s+='<h1>Extenders</h1>';
      c.set(v).select('extend').forEach(function(e)
                                   {
                                      var t=d.set(e).inner();
                                      s+='<div class="extend" onclick="documenter.setClassInfo(\''+t+'\');" style="cursor:pointer;">'+t+'</div>';
                                   });

      // publics
      s+='<h1>Public</h1>';
      c.set(v).select('public').forEach(function(e)
                                   {
                                     s+='<div>'+me.getVarStr(e)+'</div>';
                                   });

      // methods
      s+='<h1>Methods</h1>';
      c.set(v).select('method').forEach(function(e)
                                   {
                                     s+='<div>'+me.getFunctionStr(e)+'</div>';
                                   });

      this.domOut.inner(s);

      Meta.dom.bro().select('button[name="tester"]')
	.on('click',function(v)
	    {
	      var a=d.set(this).attr('father'),
	      b=d.attr('code');
	      //b=Meta.string.bro(d.set(this.previousSibling).inner()).unescapeHTML().get();
	      tester(a,b);
	    });

      c.set(this.domOut.get(0)).select('div.functionBox')
	  .forEach(function(e)
		   {
		       d.set(e).select('div.functionLine')
			   .css('cursor','pointer')
			   .on('click',toggler('div.desc',e));
		   })
	  .cleanEvents();
      dp.SyntaxHighlighter.HighlightAll('code');
    },

    /**
       <method name="show">
       <param name="tag" type="string">Clicked item</param>
       <desc>Fill the content with the selected item information</desc>
       </method>
    */
    show:function(tag)
    {
      var me=documenter,
        s='',
        c=Meta.dom.bro(),
        type='';

      switch(tag)
        {
        case 'Globals':
          this.xmlMeta.set([]).select('doc>global')
            .forEach(function(v)
                     {
			 s+='<div>'+me.getVarStr(v)+'</div>';
                     });
          me.domOut.inner(s);
          break;
        case 'Functions':
          this.xmlMeta.set([]).select('doc>function')
            .forEach(function(v)
                     {
                       s+='<div>'+me.getFunctionStr(v)+'</div>';
                     });
          me.domOut.inner(s);
	  var d=Meta.dom.bro();

	  c.set(this.domOut.get(0)).select('div.functionBox')
	      .forEach(function(e)
		       {
			   d.set(e).select('div.functionLine')
			       .css('cursor','pointer')
			       .on('click',toggler('div.desc',e));
		       })
	      .cleanEvents();

	  Meta.dom.bro().select('button[name="tester"]')
	    .on('click',function(v)
		{
		  var a=d.set(this).attr('father'),
		  b=d.attr('code');
		  //b=Meta.string.bro(d.set(this.previousSibling).inner()).unescapeHTML().get();
		  tester(a,b);
		});

	  dp.SyntaxHighlighter.HighlightAll('code');
          break;
        case 'Classes':
          me.domOut.empty();
          this.xmlMeta.set([]).select('doc>class')
            .forEach(function(v)
                     {
                       c.set(v);
                       s='<div class="class">'+c.attr('name')+'</div>';
                       c.set()
			   .doc(document)
			   .create(s).css('cursor','pointer')
			   .on('click',function()
			       {
				   me.setClassInfo(v);
			       });
                       me.domOut.append(c.get(0),1).cleanEvents();
                     });
          break;
	case 'Tests':
          me.domOut.inner('<input type="checkbox" name="log" id="assert_log"/><label for="assert_log">Log</label> <button onclick="return false;">Start</button><button onclick="return false;">Fail</button><button onclick="return false;">Pass</button><div style="height:20px;background-color:#000;margin:10px;padding:2px;"><div id="prog" style="color:#000;background-color:#bdffc0;width:0%;height:20px;text-align:center;font-weight:900;">0%</div></div><div id="fail" style="background-color:#ffcbcb;display:none;"></div><div id="pass" style="background-color:#bdffc0;display:none;"></div>');
	  var pass=Meta.dom.bro(me.domOut.get(0)).select('div#pass');
	  var fail=Meta.dom.bro(me.domOut.get(0)).select('div#fail');
	  var prog=Meta.dom.bro(me.domOut.get(0)).select('div#prog');
	  var but=Meta.dom.bro(me.domOut.get(0)).select('button');
	  var test=me.xmlMeta.bro();
	  var test2=test.bro();
	  var p=0;
	  var t=0;
	  var q;
	  var failed=0;
	  var passed=0,name='';

	  Meta.assert.log=false;
	  Meta.dom.bro().select('#assert_log')
	    .on('click',function()
		{
		  Meta.assert.log=this.checked;
		});


	  Meta.assert.onpass=function(a)
	  {
	    passed++;
	    pass.append('<div>'+a+'</div>');
	  };

	  Meta.assert.onfail=function(a)
	  {
	    failed++;
	    prog.css('background-color','#ffcbcb');
	    fail.append('<div>'+a+'</div>');
	  };

	  but.on('click',function(v)
		 {
		   switch(this.innerHTML)
		   {
		   case 'Fail':
		     pass.hide();
		     fail.show();
		     break;

		   case 'Pass':
		     fail.hide();
		     pass.show();
		     break;

		   default:
		     p=0;
		     fail.hide().empty();
		     pass.hide().empty();
		     failed=0;
		     passed=0;

		     me.xmlMeta.set([]).select('test');
		     t=me.xmlMeta.len();
		     me.xmlMeta.forEach(function(v)
				{
				  test.set(v);
				  name=test2.set(v.parentNode).attr('name');
				  if(test2.set(v.parentNode.parentNode).name()=='class')
				    name=test2.attr('name')+'.'+name;
				  testRun(name,test.text());

				  q=Math.ceil((++p/t)*100)+'%';
				  prog.inner(q+' ('+p+' of '+t+') Passed: '+passed+' Fails: '+failed).css('width',q);

				});
		     break;
		   }
		 });

          break;
        default:
          break;
        }
    },

    /**
       <method name="parse">
       <param name="txt" type="string">XML data to be parsed</param>
       <desc>Parse the XML string into a XML document</desc>
       </method>
    */
    parse:function(txt)
    {
      this.xmlMeta=Meta.dom.bro().doc(txt);
      if(this.xmlMeta._doc.firstChild.nodeName!='doc')
        {
          var s=[],p=this.xmlMeta.set([]).select('parsererror').nodes();
          s.push(p[0].nodeValue);
          s.push(p[1].firstChild.nodeValue);
          alert(s.join("\n"));
        }
      this.domList.inner('<ul><li>Globals</li><li>Functions</li><li>Classes</li><li>Tests</li></ul>');
      this.domTmp.set(this.domList.get(0)).select('li')
	  .css('cursor','pointer')
	  .on('click',function()
                  {
                    documenter.show(this.innerHTML);
                  })
	  .cleanEvents();
    },

    /**
     <method name="start">
     <desc>Start the documenter</desc>
     <param name="[a]" type="string">XML flag, if the file is an XML with the documentation.</param>
     </method>
    */
    start:function(a)
    {
      var cnt=0,
        me=this,
        max=me.files.length,
        str='',s,b=Meta.string.bro(),z=Meta.array.bro();

      me.files.sort();

      Meta.each(me.files,function(v)
                {
                  Meta.ajax(v,function(r)
                            {
			      if(a)
				{
				  me.parse(r.xml());
				  return;
				}

                              /** */
			      //s=r.text().match(/(\$\[)([^\$][^\[]*)(\]\$)/g);
                              //s=r.text().match(/(\/\*\*)([^\/][^\*][^\*]*)(\*\/)/g);
				z.set(r.text().match(/(\/\*\*)([^\/][^\*][^\*]*)(\*\/)/g))
				    .forEach(function(v)
					     {
						 b.set(v)
						     .dos2unix()
						     .trim();
						 b.substring(3,b.len()-3)
						     .trim();

						 str+=b.get();
					     });

                              if(++cnt>=max)
                                {
                                  me.parse('<doc>'+str+'</doc>');
                                  //Meta.$('ta').value='<doc>'+str+'</doc>';
                                }
                            });
                });
    }
}
);
/** </class> */
