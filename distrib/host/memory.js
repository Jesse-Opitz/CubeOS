///<reference path="../globals.js" />
/* ------------
     memory.js

     Requires global.js.

     Routines for the host MEMORY simulation, NOT for the OS itself.

------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(bytes = Array(_DefaultMemorySize)) {
            this.bytes = bytes;
            this.clearMem();
        }
        
        //TODO: Proj 3 - Add base and limit to clear a segment of memory
        // Set all bytes to 00 by default
        Memory.prototype.clearMem = function (){
            var i = _DefaultMemorySize - 1;
            while(i > 0){
                this.bytes[i] = "00";
                i--;
            }
        }
        
        //TODO: Edit a single byte in a location
        Memory.prototype.edit = function (){
            
        }
        
        //TODO: View a byte in a specific location
        Memory.prototype.viewByte = function (){
            
        }
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));