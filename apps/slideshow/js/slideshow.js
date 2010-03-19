/*
 Copyright (c) 2010 Rolando González Chévere <rolosworld@gmail.com>
 
 This file is part of SlideShow.
 
 SlideShow is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License version 3
 as published by the Free Software Foundation.
 
 SlideShow is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with SlideShow.  If not, see <http://www.gnu.org/licenses/>.
*/
function SlideShow(s)
{
  var me=this;
  me.imgs=[];                  // img array list
  me.res=[480,272];            // resolution
  me.previewDuration=1000;     // milliseconds the image preview will last
  me.animDuration=1000;        // animation duration
  me.randomAnim=true;          // random animation
  me.animType=0;               // type of animation
  me.controlsActive=true;      // Activate controls
  me.borderStyle="1px solid #000000";

  // DON'T TOUCH BELOW THIS IF YOU DON'T KNOW WHAT YOUR DOING!
  var imgs_cur=0;
  var started=0;
  var playing=0;
  var thread=null;
  var preload_cache=[];
  var preload_cache_controls=[];
  var requester=null;
  var dom=Meta.dom.$();
  var father=dom.$().select('#'+s);//document.getElementById(s);
  var App={'name':"SlideShow",'ver':'1'};
  
  var cpy,progress,loading,img_pos,next_but,play_but,control,icons,anchor,bgDiv,fgDiv,prev_but;

  icons=[];
  icons['play']="imgs/play.png";
  icons['next']="imgs/next.png";
  icons['pause']="imgs/pause.png";
  icons['prev']="imgs/prev.png";
  
  /*** SETUP FATHER ***/
  father.addClass("slideshow").
  //css("display","hidden"). // IE fail if this is not commented.. :-/
  on("mouseover",function()
    {
      if(playing)
        play_but.attr('src',icons['pause']);
      else
        play_but.attr('src',icons['play']);
      
      if(me.controlsActive)
        control.css('visibility',"visible");
      
      loading.setDisplay("visible");
      cpy.css('visibility',"visible");
    }).
  on("mouseout",function()
    {
      control.css('visibility',"hidden");
      loading.setDisplay("hidden");
      cpy.css('visibility',"hidden");
    }).
  inner(
    '<a class="main" href="#" target="_blank">'+
      '<div class="background">'+
        '<div class="foreground"></div>'+
      '</div>'+
    '</a>'+
    '<div class="controls">'+
      '<img class="previous" src="imgs/prev.png">'+
      '<img class="play" src="imgs/pause.png">'+
      '<img class="next" src="imgs/next.png">'+
      '<span class="position-label"></span>'+
    '</div>'+
    '<div class="loading-box">'+
      '<div class="progress"></div>'+
    '</div>'+
    '<a href="http://www.rolosworld.com" class="copyrights" target="_blank">&copy;2010 ROLOSWORLD.COM</a>'
  );
  
  /* IMG Layers, FG and BG */
  anchor=father.$().select('a.main',1).
    on("click",function()
    {
      if(getCurLink()!="")this.href=getCurLink();
      else return false;
    }).
    on("mouseover",function()
    {
      if(getCurLink()!="")
      {
        this.style.cursor="pointer";
        this.href=getCurLink();
      }
      else
      {
        this.style.cursor="default";
        this.href="#";
      }
    });
  
  bgDiv=father.$().select('div.background',1);
  fgDiv=father.$().select('div.foreground',1);

  /* Controls */
  control=father.$().select('div.controls',1).
    on("mouseover",function()
    {
      control.opacity(1.0);
    }).
    on("mouseout",function()
    {
      control.opacity(0.4);
    });
  
  prev_but=father.$().select('img.previous',1).
    on('mouseover',cursor_pointer).
    on('click',function(e)
    {
      me.prev();
      return false;
    });

  play_but=father.$().select('img.play',1).
    on('mouseover',cursor_pointer).
    on('click',function(e)
    {
      if(!playing)
        me.play();
      else
        me.stop();
      return false;
    });

  next_but=father.$().select('img.next',1).
    on('mouseover',cursor_pointer).
    on('click',function(e)
    {
      me.next();
      return false;
    });

  img_pos=father.$().select('span.position-label',1);

  control.
    opacity(0.4).
    css('visibility',"hidden");

  /* Loading Box */
  loading=father.$().select('div.loading-box',1).
    attr('data-progress',0).
    on('mouseover',function(){loading.opacity(1.0);}).
    on('mouseout',function(){loading.opacity(0.4);});
  
  loading.setDisplay=function(s)
    {
      if(this.attr('data-progress')!=preload_cache.length)
        this.css('visibility',s);
      else
        this.css('visibility',"hidden");
    };

  progress=father.$().select('div.progress',1);
  progress.calculate=function(p)// 0<p<1
    {
      p=Math.round(p*100);
      this.css('width',p+"px");
      if(p==100)loading.setDisplay("hidden");
    };
  
  progress.calculate(0);

  loading.
    opacity(0.4).
    setDisplay('hidden');

  /* Copyrights */
  cpy=father.$().select('a.copyrights',1).
    on('click',function(e)
    {
      return false;
    }).
    on('mouseover',function()
    {
      cpy.opacity(1.0);
    }).
    on('mouseout',function()
    {
      cpy.opacity(0.4);
    }).
    opacity(0.4).
    css('visibility','hidden');

  /***********************
   *** PRIVATE METHODS ***
   ***********************/
  function getCurLink()
  {
    var c=imgs_cur-1;
    if(c<0)c=me.imgs.length-1;
    return me.imgs[c][1];
  };

  function cursor_pointer()
  {
    this.style.cursor="pointer";
  };

  function img_mv_pos(p)
  {
    img_pos.inner((p+1)+"/"+me.imgs.length);
  };

  function preload()
  {
    preload_cache_controls[0]=dom.
      create('<img/>').
      attr('src',icons['prev']).
      get(0);

    preload_cache_controls[1]=dom.
      create('<img/>').
      attr('src',icons['play']).
      get(0);

    preload_cache_controls[2]=dom.
      create('<img/>').
      attr('src',icons['next']).
      get(0);

    preload_cache_controls[3]=dom.
      create('<img/>').
      attr('src',icons['pause']).
      get(0);

    for(var i=0; i < me.imgs.length; i++) 
    {
      preload_cache[i]=dom.
        create('<img/>').
        attr('src',me.imgs[i][0]).
        on('load',cache_loaded).get(0);
    }
  };

  function cache_loaded()
  {
    var p=parseInt(loading.attr('data-progress'),10)+1;
    loading.attr('data-progress',p);
    progress.calculate(p/preload_cache.length);
  };

  
  ///// Animation Methods
  function getAnimType()
  {
    return me.randomAnim ? Math.round(Math.random()*14) : me.animType;
  };

  function refreshThread()
  {
    if(thread)
      clearTimeout(thread);
    if(playing)
      thread=setTimeout(do_animation,me.previewDuration);
  };

  function do_animation()
  {
    if(!preload_cache[imgs_cur].complete)
    {
      refreshThread();
      return;
    }

    bgDiv.css('background-image',"url("+me.imgs[calc_next_img()][0]+")");
    fgDiv.
      fade('out',me.animDuration).
      clip(getAnimType(),me.animDuration,function()
      {
        this.css('display','');
        switch_imgs();
      });
  };
  
  function calc_next_img()
  {
    var tmp=imgs_cur+1;
    if(tmp > me.imgs.length-1)
      tmp=0;
    return tmp;
  };
  
  function set_img_cur(rev)
  {
    if(rev)
    {
      imgs_cur--;
      if(imgs_cur < 0)
        imgs_cur=me.imgs.length-1;
    }
    else
    {
      imgs_cur++;
      if(imgs_cur > me.imgs.length-1)
        imgs_cur=0;
    }
  };

  function set_next_img(rev)
  {
    set_img_cur(rev);
    img_mv_pos(imgs_cur);

    fgDiv.
      css('background-image',"url("+me.imgs[imgs_cur][0]+")").
      css('clip',"rect(0px "+me.res[0]+"px "+me.res[1]+"px 0px)").
      opacity(1.0);
      
    if(getCurLink()!="")
      father.css("cursor","pointer");
    else
      father.css("cursor","default");
  };

  function switch_imgs(rev)
  {
    set_next_img(rev);
    refreshThread();
  };

  function load_list_callback(r)
  {
    me.imgs=r.json();
    me.start();
  };

  function controlFlow(a)
  {
    if(playing)
      me.stop();
    else
      set_next_img(a);
  };
  
  /**********************
   *** PUBLIC METHODS ***
   **********************/
  me.load_list=function(s)
  {
    Meta.ajax(s,load_list_callback);
  };

  me.start=function()
  {
    if(!started)
    {
      preload();
      
      father.
        css("border",me.borderStyle).
        css("width",me.res[0]+"px").
        css("height",me.res[1]+"px").
        css("textAlign","left");
      
      bgDiv.
        css('width',me.res[0]+"px").
        css('height',me.res[1]+"px").
        css('background-image',"url("+me.imgs[0][0]+")");
        
      fgDiv.
        css('width',me.res[0]+"px").
        css('height',me.res[1]+"px").
        css('background-image',"url("+me.imgs[0][0]+")");
       
      started=1;
      imgs_cur=0;
      img_mv_pos(0);
    }
  };

  me.play=function()
  {
    play_but.attr('src',icons['pause']);

    if(!playing)
    {
      if(thread)
        clearTimeout(thread);
      playing=1;
      refreshThread();
    }
  };

  me.stop=function()
  {
    play_but.attr('src',icons['play']);
    
    if(playing)
    {
      playing=0;
      if(thread)
        clearTimeout(thread);
    }
  };

  me.next=function()
  {
    controlFlow(0);
  };

  me.prev=function()
  {
    controlFlow(1);
  };


  /**********************
   *** SECURITY CHECK ***
   **********************/
  father.css("display","block");
  return me;
};
