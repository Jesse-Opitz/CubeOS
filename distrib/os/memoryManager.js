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
            // Removes any spaces from opcodes
            noSpaceOpCodes = opCodes.replace(/\s/g, '');
            
            // Seperates hex in memory so it is like 6502 op codes
            for (var i = 0; i < noSpaceOpCodes.length; i++){
                if (i === 1){
                    _Memory.bytes[i-1] = noSpaceOpCodes[i-1] + '' + noSpaceOpCodes[i];
                }
                else if (i%2){
                    _Memory.bytes[i-2] = noSpaceOpCodes[i-1] + '' + noSpaceOpCodes[i];
                }
            }
            //console.log(_Memory.bytes);
            
            _MemoryManager.updateMemTable(_Memory.bytes);
        };
        
        // Updates the memory table
        MemoryManager.prototype.updateMemTable = function(memoryArr){
            var prettyMem = '';
            
            for (var i = 0; i < memoryArr.length; i++){
                console.log(memoryArr[i]);
                prettyMem = prettyMem + ' ' + memoryArr[i];
            }
            document.getElementById("memory").innerHTML = prettyMem;
        };
        
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));

