#!/bin/bash

FILES="meta.head.js
meta.js
meta.functions.js
meta.ajax.js
meta.core.js
meta.string.js
meta.array.js
meta.events.js
meta.jsonrpc.js
meta.eventtarget.js
meta.domevent.js
meta.select.js
meta.sandbox.js
meta.dom.js
meta.websocketevent.js
meta.websocket.js"

echo "Add cookies?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.cookie.js"
fi

echo "Add debug libs?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.popup.js meta.log.js meta.assert.js"
fi

echo "Add gui?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.guiengine.js"
fi

echo "Add animation?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.animation.js"
fi

echo "Add animation.clip?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.animation.clip.js"
fi

echo "Add animation.fade?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.animation.fade.js"
fi

echo "Add animation.slide?"
read ASK
if [ "y" == "${ASK}" ]; then
    FILES="${FILES} meta.animation.slide.js"
fi

FILES="${FILES} meta.foot.js"

#####################

echo "Merging files: ${FILES}"
rm meta.debug.js
for i in ${FILES}
do
    echo "Merging ${i}"
    cat src/${i} >> meta.debug.js
done

echo "Compiling"
java -jar compiler/compiler.jar --js=meta.debug.js --js_output_file=meta.min.js

PACK=`cat meta.min.js`
(
cat<<EOF
/*
 Copyright (c) 2016 Rolando González Chévere <rolosworld@gmail.com>
 
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
EOF
) > meta.min.js

echo ${PACK} >> meta.min.js
