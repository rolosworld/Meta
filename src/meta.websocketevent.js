/*
 Copyright (c) 2015 Rolando González Chévere <rolosworld@gmail.com>
 
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
 <class name="Meta.websocketevent">
 <desc>WebSocket events manager</desc>
 <inherit>Meta.array</inherit>
 <extend>Meta.events</extend>
 */
Meta.websocketevent=Meta(Meta.eventtarget).extend({
  valid_type:' open message error close '
});
/** </class> */
