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
        
        // Used when writing to full segment of memory
        MemoryManager.prototype.write = function (opCodes){
            
            // Clear memory
            // TODO: Proj 3 - Add base and limit
            _Memory.clearMem();
            
            this.updateMemTable(opCodes);
            
            // Removes any spaces from opcodes
            noSpaceOpCodes = opCodes.replace(/\s/g, '');
            var groupedCodes= '';
            
            // Seperates hex in memory so it is like 6502 op codes
            for (var i = 0; i < noSpaceOpCodes.length; i++){
                if (i%2){
                    groupedCodes += noSpaceOpCodes[i-1] + noSpaceOpCodes[i] + ' ';
                }
            }
            
            for (var i = 0; i < groupedCodes.split(' ').length-1; i++){
                _Memory.bytes[i] = groupedCodes.split(' ')[i];
            }
            
            console.log('Bytes in main memory: ' + _Memory.bytes);
            console.log('Length of bytes in main memory: ' + _Memory.bytes.length);
            
            _MemoryManager.updateMemTable(_Memory.bytes);
        };
        
        // Updates the memory table
        MemoryManager.prototype.updateMemTable = function(memoryArr){
            var prettyMem = '';
            
            for (var i = 0; i < memoryArr.length; i++){
                prettyMem = prettyMem + ' ' + memoryArr[i];
            }
            
            document.getElementById("memory").innerHTML = prettyMem;
        };
        
        // Used to edit specific parts of memory
        // Mainly for storing the accumulator in memory, op code 8D
        // Can only change 1 byte at a time
        /* 
          I put this in a function here because the code executing
          shouldn't be touching memory directly. This is "security"
          function for memory, even though it doesn't do anything special
          or stop attacks in any way. EX: If user security was implented,
          this is where I would stop other user's from interacting with 
          someone else's memory.
          |->This makes sense to me, may not be true. Please let me know
          |->if it is a correct practice or if I am doing it wrong.
        */
        // THIS GOES IN MEMORY ACCESSOR, MEMORY.JS FOR THIS PROJECT
        /*
        MemoryManager.prototype.editMem = function(byte, location) {
            _Memory.bytes[location] = byte;
            // TODO Update memory table in GUI here
        };*/
        
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));

