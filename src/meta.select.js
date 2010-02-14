Meta.select=(function()
{
  // Regexp taken from jQuery.
  var re={
    CHUNKER:/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]+['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g,
    ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/g,
    CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/g,
    NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/g,
    ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g,
    TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/g,
    CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/g,
    POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/g,
    PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/g
  },//"

  // Filter the attributes
  attrFilter={
    '=':function(a,b){return a==b;},
    '!=':function(a,b){return a!=b;},
    '~=':function(a,b){return a!==null&&(' '+a+' ').indexOf(b)>-1;},
    '^=':function(a,b){return a!==null&&a.indexOf(b)==0;},
    '*=':function(a,b){return a!==null&&a.indexOf(b)>-1;},
    '$=':function(a,b){return a!==null&&(a.lastIndexOf(b)+b.length)==a.length;},
    '|=':function(a,b){return a==b||a.indexOf(b+'-')==0;},
    '':function(a,b){return a!==null;}
  },

  filters={
    'tag':function(node,a)
    {
      return node.nodeName==a||a=='*';
    },
    'className':function(node,a)
    {
      var b=node.className;
      return b&&(' '+b+' ').indexOf(' '+a+' ')>-1;
    },
    'attr':function(node,a)
    {
      // a=[[,name,type,,val]]
      var aname,
          b,
          i=a.length,
          attr;
      
      while(i--)
      {
	b=a[i];
        aname=b[1];
        if(node.nodeType==1)
	{
	  attr=node.getAttribute(aname);
	  if(attr!==null&&b[2](attr,b[4]))
	    continue;
	}
        return 0;
      }
      return 1;
    },
    'pseudo':function()
    {
      return 0;
    },
    'nest':function(node,a)
    {
      var n=a[0],
          b=a[1],
          c;
      
      if(!node)
	return 0;

      //if(n[parseInt(node[b],10)]!=node)
      if(n[parseInt(node.getAttribute(b),10)]!=node)
      {
	c=n.length;
        //node[b]=c;
        node.setAttribute(b,c);
        n[c]=node;
        return 1;
      }
      return 0;
    }
  },

  selectors={
    '>':function(node,name,nn,nest,fdata,vnode,f)
    {
      var _nodes=node.childNodes,
          k,
          l,
          nodes=[];

      for(k=0,l=_nodes.length;k<l;k++)
      {
	node=_nodes[k];
	if(node.nodeType!=1)
	  continue;

	if(vnode(node,fdata,f))
	  nodes.push(node);
      }
      return nodes;
    },
    '~':function(node,name,nn,nest,fdata,vnode,f)
    {
      var nodes=[],
          idx;
      
      while((node=node.nextSibling))
      {
	if(node.nodeType==1&&vnode(node,fdata,f))
	  nodes.push(node);
      }
      return nodes;
    },
    '+':function(node,name,nn,nest,fdata,vnode,f)
    {
      while((node=node.nextSibling)&&node.nodeType!=1){}
      return vnode(node,fdata,f)?[node]:[];
    }
  };

  function validNode(node,fdata,f)
  {
    var i,
        j=0;
    
    if(node)
    {
      j=1;
      for(i in fdata)
      {
	if(fdata[i]&&!f[i](node,fdata[i]))
	{
	  j=0;
	  break;
	}
      }
    }
    return j;
  };

  // ID = m[1]
  // CLASS = m[1]
  // NAME = m[1]
  // ATTR = [m[1],m[2],m[4]] --> [attr,type,value]
  // TAG = m[1]
  // CHILD = m[1]
  // POS = m[1]
  // PSEUDO = m[1]


  // a CSS rules
  // b Context
  return function(a,b)
  {
    b=b||document;

    if(b.querySelectorAll)
      return Meta.obj2array(b.querySelectorAll(a));

    var chunk=re.CHUNKER,
        m,
        n,
        o,
        rule,
        sel,
        nodes=[b],
        _id=re.ID,
        _class=re.CLASS,
        _name=re.NAME,
        _attr=re.ATTR,
        _tag=re.TAG,
        _child=re.CHILD,
        _POS=re.POS,
        _PSEUDO=re.PSEUDO,
        doc=(b.nodeType==9?b:b.ownerDocument),
        i,
        j,
        k,
        l,
        node,
        _nodes2,
        _nodes,
        isxml=doc.documentElement.nodeName!=='HTML',
        nest,
        nn='data-metaNest',
        pos=0,
        fnodes=[],
        fdata={},
        _filters=filters,
        afilters=attrFilter,
        vnode=validNode;

    chunk.lastIndex=0;
    while((m=chunk.exec(a)))
    {
      rule=m[1];

      if(rule=='>'||
	 rule=='~'||
	 rule=='+')
      {
	sel=selectors[rule];
        continue;
      }

      nest=[];

      // ID, it overrides the other rules since the ID should be unique.
      _id.lastIndex=0;
      n=_id.exec(rule);
      if(n)
      {
	node=doc.getElementById(n[1]);
        if(_filters.nest(node,[nest,nn]))
	  nodes=[node];
	else
	  nodes=[];
      }
      else
      {
	// NEST
	fdata.nest=[nest,nn];

        // ATTR
        fdata.attr=[];
        _attr.lastIndex=0;
        while((n=_attr.exec(rule))!==null)
        {
	  n[2]=afilters[n[2]||''];
	  fdata.attr.push(n);
        }
        
        if(!fdata.attr.length)
	  fdata.attr=0;

	// CLASS
	if(!fdata.attr)
	{
	  _class.lastIndex=0;
	  n=_class.exec(rule);
	  fdata.className=n?n[1]:n;
	}

        // TAG
        _tag.lastIndex=0;
        n=_tag.exec(rule);
	n=n?n[1]:'*';
	n=isxml?n:n.toUpperCase();
	fdata.tag=n;

        /////////////////////////////////
        _nodes2=[];
        for(i=0,j=nodes.length;i<j;i++)
	{
	  node=nodes[i];
	  if(sel)
	    _nodes2=_nodes2.concat(sel(node,n,nn,nest,fdata,vnode,_filters));
	  else
	  {
	    _class.lastIndex=0;
	    o=_class.exec(rule);
	    
            if(o&&node.getElementsByClassName)
	    {
	      _nodes=node.getElementsByClassName(o[1]);
	      o=0;
	    }
	    else
	      _nodes=node.getElementsByTagName(n);

	    if(!o)
	      fdata.className=0;

	    for(k=0,l=_nodes.length;k<l;k++)
	    {
	      node=_nodes[k];
	      if(vnode(node,fdata,_filters))
		_nodes2.push(node);
	    }
	    o=0;
	  }
        }
        nodes=_nodes2;
      }
      sel=null;

      if(m[2]&&m[2].replace(/^\s+|\s+$/g,"")==',')
      {
	fnodes[pos++]=nodes;
        nodes=[b];
	continue;
      }
    }

    fnodes[pos]=nodes;

    nest=[];
    nodes=[];
    for(i=0,j=fnodes.length;i<j;i++)
    {
      _nodes=fnodes[i];
      for(k=0,l=_nodes.length;k<l;k++)
      {
	node=_nodes[k];
	if(_filters.nest(node,[nest,nn]))
	  nodes.push(node);
      }
    }

    return nodes;
  };
}());