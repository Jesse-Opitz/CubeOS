///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, indexHistory, commandHistory = []) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.indexHistory = indexHistory;
            this.commandHistory = commandHistory;
            
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        // Clears line, creates a new one with desired message
        Console.prototype.clearLine = function(newmsg) {
            // Removes current line from canvas
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, this.currentXPosition, this.currentFontSize + _FontHeightMargin);
            
            // Reset X position
            this.currentXPosition = 0;
            
            // Rewrite to canvas
            this.putText('>' + newmsg);
        };
        
        // Handles backspace
        Console.prototype.backspace = function(){
            // Removes last character from the buffer
            this.buffer = this.buffer.substring(0, this.buffer.length-1);
            
            // Fixes canvas to new command
            this.clearLine(this.buffer);
        };
        
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                console.log('here' + chr)
                if ( chr === String.fromCharCode(8)) {
                    // Handle backspace
                    this.backspace();
                } 
                else if (chr === String.fromCharCode(38)) {
                    // Handles up arrow
                    if (this.commandHistory.length >= 1) {
                        //document.getElementById("console").innerHTML = this.commandHistory[indexHistory - 1] + ' ' + indexHistory;
                        // Fixes canvas to new command
                        this.clearLine(this.commandHistory[indexHistory - 1])
                        
                        // Set buffer to new command
                        this.buffer = this.commandHistory[indexHistory - 1]
                        
                        if (indexHistory > 1) {
                            indexHistory = indexHistory - 1;
                        }
                    }
                }
                else if (chr === String.fromCharCode(40)) {
                    
                    if (indexHistory < this.commandHistory.length) {
                        
                        // Fixes canvas to new command
                        this.clearLine(this.commandHistory[indexHistory - 1])
                        
                        // Set buffer to new command
                        this.buffer = this.commandHistory[indexHistory - 1]
                        
                        if (indexHistory < this.commandHistory.length) {
                            indexHistory = indexHistory + 1;
                        }
                    }
                }
                else if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    if (this.buffer != '') {
                        this.commandHistory.push(this.buffer);
                        indexHistory = this.commandHistory.length;
                        //document.getElementById("history").innerHTML = this.commandHistory + ' : ' + this.commandHistory.length;
                    }
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr == "55") {
                    this.putText("&");
                    this.buffer += "&";
                }
                else if (chr == "5/5") {
                    this.putText("7");
                    this.buffer += "7";
                }
                else if (chr == "57"){
                    this.putText("(");
                    this.buffer += "(";
                }
                else if (chr == "5/7"){
                    this.putText("9");
                    this.buffer += "9";
                }
                else {
                    //document.getElementById("console").innerHTML = chr
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    document.getElementById("status").innerHTML = chr;
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            // Checks if the position is going to be bigger than the canvas
            if (this.currentYPosition > _Canvas.height) {
                //document.getElementById("console").innerHTML = "Move Down";
                
                // Screen shot canvas
                // Using this.currentFontSize + _FontHeightMargin for sy takes out the top line
                var  ssCanvas= _DrawingContext.getImageData(0, this.currentFontSize + _FontHeightMargin, _Canvas.width, _Canvas.height)
                
                // Clear Screen
                this.clearScreen();
                
                // Paste screen shot back on canvas
                _DrawingContext.putImageData(ssCanvas, 0, 0);
                
                // Reset the Y position to bottom of canvas and 
                this.currentYPosition = _Canvas.height - this.currentFontSize - _FontHeightMargin;
            }
        };
        
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
