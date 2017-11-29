/*
 Copyright (c) 2017 Rolando González Chévere <rolosworld@gmail.com>
 
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
   <class name="Meta.queue">
   <desc>Class to fire a callback once a queue is done</desc>
   <inherit>Meta.core</inherit>
 */
Meta.queue=Meta(Meta.core).extend(
{
    cnt:null,
    started:0,

  /**
   <method name="increase" type="void">
   <desc>Increment the queue size</desc>
   </method>
   */
    increase: function(){
        this.cnt++;
    },

  /**
   <method name="decrease" type="void">
   <desc>Reduce the queue size and fire the callback if the size becomes zero</desc>
   </method>
   */
    decrease: function(){
        if (!--this.cnt && this.started) {
            this._();
        }
    },

  /**
   <method name="start" type="void">
   <desc>Try running the callback</desc>
   </method>
   */
    start: function(){
        this.started = 1;
        if (!this.cnt) {
            this._();
        }
    }
});
/** </class> */
