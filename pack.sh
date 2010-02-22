#!/bin/bash

FILES="meta.head.js
meta.js
meta.functions.js
meta.ajax.js
meta.core.js
meta.string.js
meta.array.js
meta.events.js
meta.domevent.js
meta.select.js
meta.sandbox.js
meta.dom.js"

echo "Add cookies?"
read ASK
if [ -n "${ASK}" ]; then
    FILES="${FILES} meta.cookie.js"
fi

echo "Add debug libs?"
read ASK
if [ -n "${ASK}" ]; then
    FILES="${FILES} meta.popup.js meta.log.js meta.assert.js"
fi

echo "Add gui?"
read ASK
if [ -n "${ASK}" ]; then
    FILES="${FILES} meta.guiengine.js"
fi

echo "Add animation?"
read ASK
if [ -n "${ASK}" ]; then
    FILES="${FILES} meta.animation.js"
fi

echo "Add animation.clip?"
read ASK
if [ -n "${ASK}" ]; then
    FILES="${FILES} meta.animation.clip.js"
fi

echo "Add animation.fade?"
read ASK
if [ -n "${ASK}" ]; then
    FILES="${FILES} meta.animation.fade.js"
fi

echo "Add animation.slide?"
read ASK
if [ -n "${ASK}" ]; then
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
