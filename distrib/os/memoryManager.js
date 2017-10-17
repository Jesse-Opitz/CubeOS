///<reference path="../globals.js" />
///<reference path="../host/memory.js" />
/* ------------
     CPU.js

     Requires global.js
              ../host/memory.js

     Routines for the host MEMORY simulation, NOT for the OS itself.

------------ */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            if (_Memory === null || _Memory === undefined) {
                _Memory = new TSOS.Memory();
            }
        }
        
        // Used when writing to memory
        MemoryManager.prototype.write = function (opCodes){
            var limit = 256;
            var opCodeIndex = 0;
            var memStr = "";
            for (var i = 0; i < limit; i++){
                if (opCodes[opCodeIndex] === undefined){
                    opCodes[opCodeIndex] = "00"
                }
                
                _Memory.bytes[i] = opCodes[opCodeIndex];
                
                // This is for printing to screen purposes
                //if (i % 2){
                //    memStr += opCodes[opCodeIndex] + " ";
                //}
                //else {
                //    memStr += opCodes[opCodeIndex];
                //}
                
                opCodeIndex++;
            }
            console.log(opCodes);
            _MemoryManager.updateMemTable(opCodes);
        };
        
        // Updates the memory table
        MemoryManager.prototype.updateMemTable = function(opCodes){
            document.getElementById("memory").innerHTML = opCodes;
        };
        
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));

