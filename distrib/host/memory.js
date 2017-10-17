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
            // Set all bytes to 00 by default
            var i = _DefaultMemorySize;
            while(i > 0){
                if (this.bytes[i] == undefined){
                    this.bytes[i] = 00;
                }
                i--;
            }
        }
        
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));