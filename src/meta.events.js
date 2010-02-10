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
   <class name="Meta.events">
   <desc>
   Events extensions.
   Event data structure (EDS):
   {
     event_type:[
                  { type: event_type, obj: object_owner_of_event, cb: main_callback_function_calls_every_callback, fn: [ callbacks, ... ] },
		  ...
		],
     ...
   }
   </desc>
   <inherit>Meta.core</inherit>
*/
//Meta.events=Meta(Meta.array);
Meta.events=Meta(Meta.core);
Meta.events.extend(
function()
{
  /**
      Private and static variable where the events are stored.
   */
  var events={},arr=Meta.array.bro();

  /**
      <method name="onNewEvent" type="void">
      <desc>Callback for when a new event type is inserted for a given object</desc>
      <param name="a" type="object">EDS</param>
      </method>
   */
  this.onNewEvent=function(){};

  /**
      <method name="onEmptyEvent" type="void">
      <desc>Callback for when the object has no event of the given type</desc>
      <param name="a" type="object">EDS</param>
      </method>
   */
  this.onEmptyEvent=function(){};

  /**
      <method name="onFireEvent" type="void">
      <desc>Callback for when a single callback of the given type is called</desc>
      <param name="a" type="object">EDS</param>
      <param name="b" type="bool">true if every callback returned true, else false</param>
      <param name="c" type="array">arguments</param>
      </method>
   */
  this.onFireEvent=function(){};

  /**
      <method name="addEvent" type="this">
      <desc>Add a new callback to the event of the given object</desc>
      <param name="a" type="string">Event type</param>
      <param name="b" type="object">Object</param>
      <param name="c" type="mixed">Single function callback or array of callbacks</param>
      <param name="[e]" type="bool">Repeat flag. Only works for single functions. Default 1, it repeats.</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),d,b={},c=function(){d=true;};
      a.addEvent('addEvent',b,c); // added
      a.addEvent('addEvent',b,c); // added
      a.addEvent('addEvent',b,c,0); // ignored, since its already added
      a.fireEvent('addEvent',b);
      a.rmEvent('addEvent',b);
      return d;
      ]]>
      </test>
      </method>
  */
  this.addEvent=function(a,b,c,e)
  {
    e=e===undefined?1:e;

    var d=-1,me=this;

    // Event type not initialized, so initialize it
    if(!events[a])events[a]=[];

    // Check if object is defined on the event, else add it
    else d=me.indexOfEvent(a,b);

    if(d<0)
    {
      d={
	type:a,
	obj:b,
	cb:function()
	{
	  return me.fireEvent.apply(me,arr.set([a,b]).concat(Meta.obj2array(arguments)).get());
	},
	fn:[]
      };

      events[a].push(d);
      me.onNewEvent(d);
    }
    else d=events[a][d];

    // Add the callback function, can be repeated
    arr.set(d.fn);
    if(Meta.its(c,'array'))
    {
      arr.concat(c);
      d.fn=arr.get();
    }
    else
    {
      // If it should be not repeated, check if it exist, else push it
      if(e||arr.indexOf(c)<0)
	arr.push(c);
    }

    return me;
  };

  /**
      <method name="getEvent" type="object">
      <desc>Get the EDS of the event from the given object. Returns null if none found.</desc>
      <param name="a" type="string">Event type</param>
      <param name="b" type="integer">EDS id</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),b={},c=function(){},d,e;
      a.addEvent('getEvent',b,c);
      d=a.getEvent('getEvent',a.indexOfEvent('getEvent',{}));
      e=d===null;
      d=a.getEvent('getEvent',a.indexOfEvent('getEvent',b));
      e=d && d.obj===b;
      a.rmEvent('getEvent',b);
      return e;
      ]]>
      </test>
      </method>
   */
  this.getEvent=function(a,b)
  {
    if(events[a]&&events[a][b])
      return events[a][b];
    else return null;
  };

  /**
      <method name="getObjectEvents" type="array">
      <desc>Get all the EDS of the given object. Returns [] if none found.</desc>
      <param name="a" type="object">Object</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),b={},c=function(){},d,e;
      a.addEvent('event1',b,c);
      a.addEvent('event1',b,c);
      a.addEvent('event2',b,c);
      a.addEvent('event2',b,c);
      d=a.getObjectEvents(b);
      e=d.length==2;
      a.rmEvent('event1',b);
      a.rmEvent('event2',b);
      return e;
      ]]>
      </test>
      </method>
   */
  this.getObjectEvents=function(a)
  {
    var b=[],c,me=this;
    for(var i in events)
    {
      c=me.indexOfEvent(i,a);
      if(c>-1)b.push(events[i][c]);
    }
    return b;
  };

  /**
      <method name="indexOfEvent" type="integer">
      <desc>Index of the EDS of the event from the given object. Returns -1 if none found.</desc>
      <param name="a" type="string">Event type</param>
      <param name="b" type="object">Object</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),b={},c=function(){},d;
      a.addEvent('indexOfEvent',b,c);
      d=a.indexOfEvent('indexOfEvent',b);
      a.rmEvent('indexOfEvent',b);
      return d==0;
      ]]>
      </test>
      </method>
   */
  this.indexOfEvent=function(a,b)
  {
    var c=-1;
    if(!events[a])return c;
    arr.set(events[a]).every(function(v,i)
			     {
			       if(v.obj==b)
			       {
				 c=i;
				 return false;
			       }
			       return true;
			     });
    return c;
  };

  /**
      <method name="fireEvent" type="bool">
      <desc>Fire the given event type for the given object. Returns false if any callback returns false, else true.</desc>
      <param name="a" type="string">Event type</param>
      <param name="b" type="object">Object</param>
      <param name="[...]" type="mixed">Custom arguments to pass to the callbacks</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),d,b={},c=function(){d=true;};
      a.addEvent('fireEvent',b,c); // added
      a.addEvent('fireEvent',b,c); // added
      a.addEvent('fireEvent',b,c,0); // ignores, since its already added
      a.fireEvent('fireEvent',b);
      a.rmEvent('fireEvent',b);
      return d;
      ]]>
      </test>
      </method>
   */
  this.fireEvent=function(a,b)
  {
    var me=this,d=me.indexOfEvent(a,b),e=true,c,f;
    if(d<0)return false;

    f=events[a][d];

    // Create array of arguments
    c=[];
    Meta.each(arguments,function(v,i){if(i>1)c.push(v);});

    // Call all the callbacks with the arguments
    Meta.each(f.fn,function(w)
              {
		if(w.apply(b,c)===false)
		  e=false;
	      });

    me.onFireEvent(f,e,c);
    return e;
  };

  /**
      <method name="rmEvent" type="this">
      <desc>Remove the given callback or callbacks of the event type for the given object.</desc>
      <param name="a" type="string">Event type</param>
      <param name="b" type="object">Object</param>
      <param name="[c]" type="function">Callback to be removed. If not defined, removes the whole event.</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),b={},c=function(){},d,e;
      a.addEvent('rmEvent',b,c);
      a.rmEvent('rmEvent',b);
      d=a.indexOfEvent('rmEvent',b);
      e=d==-1;
      a.addEvent('rmEvent',b,c);
      a.rmEvent('rmEvent',b,c);
      d=a.indexOfEvent('rmEvent',b);
      return e && d==-1;
      ]]>
      </test>
      </method>
   */
  this.rmEvent=function(a,b,c)
  {
    var d,e=-1,f,g=this.indexOfEvent(a,b);
    if(g<0)return this;
    d=events[a][g];

    // Remove all the callbacks
    if(!c)d.fn=[];
    else
    {
      // Remove only one callback
      f=arr.set(d.fn);
      e=f.indexOf(c);
      if(e>-1)f.drop(e);
    }

    // Remove the whole event for the given object
    if(!d.fn.length)
    {
      arr.set(events[a]).drop(g);
      this.onEmptyEvent(d);
    }
    return this;
  };

  /**
      <method name="rmObject" type="this">
      <desc>Removes all the events for the given object.</desc>
      <param name="a" type="object">Object</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),b={},c=function(){},d;
      a.addEvent('rmObject',b,c);
      a.rmObject(b);
      d=a.indexOfEvent('rmObject',b);
      return d==-1;
      ]]>
      </test>
      </method>
   */
  this.rmObject=function(a)
  {
    var me=this;
    Meta.each(events,function(v,i)
              {
		me.rmEvent(i,a);
	      },1);
    return me;
  };

  /**
      <method name="flush" type="this">
      <desc>Removes all the events defined or the ones selected by a callback.</desc>
      <param name="[a]" type="function">Callback function to select wich event remove. If return true remove, else dont remove</param>
      <test>
      <![CDATA[
      var a=Meta.events.bro(),b={},c=function(){},d,e;
      a.addEvent('event1',b,c);
      a.addEvent('event2',b,c);
      a.flush(function(a,b){return a=='event2';});
      d=a.indexOfEvent('event1',b);
      e=d==0;
      d=a.indexOfEvent('event2',b);
      e=e&&d==-1;
      a.flush();
      d=a.indexOfEvent('event1',b);
      return e && d==-1;
      ]]>
      </test>
      </method>
   */
  this.flush=function(a)
  {
    a=a||function(){return 1;};
    var me=this,b=[],j;
    Meta.each(events,function(v,i)
              {
		j=v.length;
		while(j--)
		{
		  if(a(i,v[j].obj))
		    me.rmEvent(i,v[j].obj);
		}

		if(!v.length)b.push(i);
	      },1);

    j=b.length;
    while(j--)
      delete events[b[j]];

    return me;
  };

  // For debug
  this.ev=events;
});
/** </class> */
