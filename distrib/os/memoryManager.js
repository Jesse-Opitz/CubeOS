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
            // If Memory doesn't exist create it
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
                _Memory.memory[i] = opCodes[opCodeIndex];
                if (i % 2){
                    memStr += opCodes[opCodeIndex] + " ";
                }
                
                opCodeIndex++;
            }
            
            TSOS.Control.updateMemTable(memStr);
        };
        
        // Used when reading memory
        // I use this for creating the table for now
        MemoryManager.prototype.read = function(){
            
        }
        
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));

/*var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            // If Memory doesn't exist create it
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
                _Memory.memory[i] = opCodes[opCodeIndex];
                if (i % 2){
                    memStr += opCodes[opCodeIndex] + " ";
                }
                
                opCodeIndex++;
            }
            
            TSOS.Control.updateMemTable(memStr);
        };

        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));*/