# garbler
JavaScript toy that replaces text in the DOM

#Basic Usage
    <script src="garbler.js"></script>
    var garbler = new Garbler();
    garbler.start();
    
# API
##garble(intervalInMilliseconds, garblesPerInterval)
Updates the frequency of the garbling and how many characters get garbled per iteration. Also automatically calls start().  If you don't want the garbling to start immediately, use the update method.
##update(intervalInMilliseconds, garblesPerInterval)
Same as garble, but doesn't automatically call start().
##start()
Manually starts the garbling process.
##stop()
Manually stops the garbling process.
##reset()
Puts all the original text back in the DOM.  Note, call stop() before reset() if you don't want the Garbler to re-garble the text you just reset back.
##isRunning()
Returns a boolean.  True if the Garbler is actively garbling text, false if not.
##setGarbleCharacters(charactersArray)
Allows you to pass in a set of characters use when replacing text. Example: setGarbleCharacters(["-"]) will eventually replace each character in the DOM with a hyphen.
##setTarget($target)
Allows you to specifically only garble within a particular DOM element. Note, children of the supplied $target are also garbled.
##getIntervalInMilliseconds()
Returns how often the DOM is garbled in milliseconds.
##getGarblesPerInterval()
Returns the number of garbled characters per iteration.
##getTarget()
Returns the current target of the Garbler.
##buildCharactersArray: function(startCode, endCode)
A helper function that can be used with setGarbledCharacters. Fills an array with the characters represented by the startCode through the endCode (inclusive).
##buildNormalCharactersArray()
A helper function that can be used with setGarbledCharacters. Fills an array with the character codes from 32 to 126. See [ASCII lookup table](http://www.asciitable.com/).
##buildCthuluCharactersArray()
A helper function that can be used with setGarbledCharacters. Fills an array with Cthulu-y Unicode characters.