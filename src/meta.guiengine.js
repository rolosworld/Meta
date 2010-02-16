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
 <class name="Meta.guiEngine">
 <inherit>Meta</inherit>
 <desc>
   Engine for guis
   -gui="drag"   Drags the element or the given dad
   -gui="resize" Resize the element or the given dad
   -dad="id"     Define the element that will receive the alterations
   -limit="id"   Define the element that limits
   Methods:
   -guiStart  Starts the engine
   -guiStop   Stops the engine
   -guiEngine Returns 1 if the engine is runnig
   Dependencies:
   -Meta
   -Meta.dom
   -Meta.domevent
 </desc>
*/
Meta.guiEngine=Meta(function()
{
  var cur=Meta.dom.bro(),
      cur_limit=Meta.dom.bro(),
      win=Meta.domevent.bro(document),
      bod,bod_bak={},
      limit=[0,0,0,0],
      cur_dims={
        left:0,
        top:0,
        width:0,
        height:0
      },
      screen_pos=[0,0],
      gui='',
      started=0,
      acts={

        // Drag actions
        'drag':{
          'md':function(e) // doc.mousedown
          {
            cur_dims=cur.dims();
            disableSelection();
            cur.
              css('position','absolute').
              css('zIndex','1');
          },
          'mu':function(e) // doc.mouseup
          {
            selRestore();
            cur.css('zIndex','0');
          },
          'mmv':function(e,dt)  // doc.mousemove
          {
            var p=cur_dims,
                m=[
                  limit[2]-s[0],
                  limit[3]-s[1]
                ];
            
            dt=[
              p.left+dt[0],
              p.top+dt[1]
            ];

            if(dt[0]>=limit[0]&&dt[0]<m[0])
            {
              p.left=dt[0];
              screen_pos[0]=e.screenX;
            }
            else if(dt[0]<limit[0])
              dt[0]=limit[0];
            else if(dt[0]>m[0])
              dt[0]=m[0];

            if(dt[1]>=limit[1]&&dt[1]<m[1])
            {
              p.top=dt[1];
              screen_pos[1]=e.screenY;
            }
            else if(dt[1]<limit[1])
              dt[1]=limit[1];
            else if(dt[1]>m[1])
              dt[1]=m[1];
            
            cur.css('left',dt[0]+'px');
            cur.css('top',dt[1]+'px');
          }
        },

        // Resize actions
        'resize':{
          'md':function(e) // doc.mousedown
          {
            disableSelection();
          },
          'mu':function(e) // doc.mouseup
          {
            selRestore();
          },
          'mmv':function(e,dt)
          {
            var s=cur.dims();
            dt=[
              s.width+dt[0],
              s.height+dt[1]
            ];
            if(dt[0]>=10)
            {
              cur.css('width',dt[0]+'px');
              screen_pos[0]=e.screenX;
            }

            if(dt[1]>=10)
            {
              cur.css('height',dt[1]+'px');
              screen_pos[1]=e.screenY;
            }
          }
        }
      };

  /**
   * Backup important element selection settings
   */
  function selBackup()
  {
    if('meta_sel' in bod_bak)
      return;

    bod_bak.meta_sel=1;
    bod_bak.meta_onselectstart=bod.get().onselectstart;
    bod_bak.meta_unselectable=bod.get().unselectable;
    bod_bak.meta_MozUserSelect=bod.css('MozUserSelect');
    bod_bak.meta_KhtmlUserSelect=bod.css('KhtmlUserSelect');
  };

  /**
   * Restore important element selection settings
   */
  function selRestore()
  {
    if(!('meta_sel' in bod_bak))
      return;
    
    bod.css('MozUserSelect',bod_bak.meta_MozUserSelect);
    bod.css('KhtmlUserSelect',bod_bak.meta_KhtmlUserSelect);
    bod.get().onselectstart=bod_bak.meta_onselectstart;
    bod.get().unselectable=bod_bak.meta_unselectable;
  };

  /**
   * Disable selection for the element
   */
  function disableSelection()
  {
    selBackup();
    bod.get().onselectstart=function(){return false;};
    bod.get().unselectable="on";
    bod.css('MozUserSelect',"none").
      css('KhtmlUserSelect',"none");
  };

  function getE(e){return e?e:window.event;};

  // document.mousemove
  function mmv(e)
  {
    if(!gui||!cur.len())
      return false;
    
    e=getE(e);
    var dt=[
      e.screenX-screen_pos[0],
      e.screenY-screen_pos[1]
    ];

    if('mmv' in acts[gui])
      acts[gui].mmv(e,dt);

    e.cancelBubble=true;
    return false;
  };

  // document.mousedown
  function md(e)
  {
    e=getE(e);
    cur.set(e.target||e.srcElement);
    gui=cur.attr('gui');
    
    if(!(gui in acts))
      return false;
    
    var dad=cur.attr('dad'),
        l=cur.attr('limit');
    
    if(dad)
      cur.select('#'+dad);

    if(l)
      cur_limit.select('#'+l);
    else
      cur_limit.set(bod.get());
    
    setLimit();

    if('md' in acts[gui])
      acts[gui].md(e);

    screen_pos=[e.screenX,e.screenY];
    e.cancelBubble=true;
    return false;
  };

  // document.mouseup
  function mu(e)
  {
    if(!gui)
      return false;
    
    e=getE(e);

    if('mu' in acts[gui])
      acts[gui].mu(e);

    screen_pos=[e.screenX,e.screenY];
    e.cancelBubble=true;
    gui='';
    return false;
  };

  /**
   * Set the limit
   */
  function setLimit()
  {
    var o=cur_limit,
        p=o.dims();
    
    limit=[
      p.left,
      p.top,
      t.width+p.left,
      t.height+p.top
    ];
  };

  function start()
  {
    if(started)
      return;
    
    win.
      on('mousemove',mmv).
      on('mousedown',md).
      on('mouseup',mu);
    
    started=1;
    bod=Meta.dom.bro().set(document.body);
    cur_limit.set(bod.get());
    setLimit();
  };

  function stop()
  {
    if(!started)
      return;
    
    win.
      rmOn('mousemove',mmv).
      rmOn('mousedown',md).
      rmOn('mouseup',mu);
    
    started=0;
  };

  return {
    /**
     <method name="guiStart" type="void">
     <desc>Start the engine</desc>
     </method>
     */
    guiStart:start,

    /**
     <method name="guiStop" type="void">
     <desc>Stop the engine</desc>
     </method>
     */
    guiStop:stop,

    /**
     <method name="guiEngine" type="bool">
     <desc>Check if the engine is running.</desc>
     </method>
     */
    guiEngine:function(){return started;}
  };
}());
/** </class> */
