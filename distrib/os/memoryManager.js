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
            // Keeps track of which segment is next
            //var segment = _segNumber % 3;
            var segment = this.getMemSegment();
            
            // Gets tuple of base and limit
            var baseLimit = this.getBaseLimit(segment);
            
            var base = baseLimit[0];
            var limit = baseLimit[1];
            
            // Clear memory
            // TODO: Proj 3 - Add base and limit
            _Memory.clearMem(base, limit);
            
            console.log("Writing to segment " + segment);
            console.log("Base is: " + base);
            //this.updateMemTable(opCodes); - old call
            
            // Removes any spaces from opcodes
            noSpaceOpCodes = opCodes.replace(/\s/g, '');
            var groupedCodes= '';
            
            // Seperates hex in memory so it is like 6502 op codes
            for (var i = 0; i < noSpaceOpCodes.length; i++){
                if (i%2){
                    groupedCodes += noSpaceOpCodes[i-1] + noSpaceOpCodes[i] + ' ';
                }
            }
            
            for (var i = base; i < ((groupedCodes.split(' ').length-1) + base); i++){
                // grouped codes needs i - base to start at 0
                _Memory.bytes[i] = groupedCodes.split(' ')[i-base];
            }
            
            console.log('Bytes in main memory: ' + _Memory.bytes);
            console.log('Length of bytes in main memory: ' + _Memory.bytes.length);
            
            // _MemoryManager.updateMemTable(_Memory.bytes); - old call
            this.updateMemTable(_Memory.bytes);
            
            _segNumber += 1;
        };
        
        // Updates the memory table
        MemoryManager.prototype.updateMemTable = function(memoryArr){
            var loc = 0;
            
            // creating all cells
            for (var i = 0; i < (_DefaultMemorySize/8); i++) {
            // creates a table row
                for (var j = 0; j < 8; j++) {
                    // Create a <td> element and a text node, make the text
                    // node the contents of the <td>, and put the <td> at
                    // the end of the table row
                    var cell = document.getElementById("mem" + loc).innerHTML = _Memory.bytes[loc];
                    loc++;
                    
                }
 
            }

        };
        
        // returns current segment
        MemoryManager.prototype.getMemSegment = function(){
            return segment = _segNumber % 3;
        };
        
        // returns tuple of base and limit
        MemoryManager.prototype.getBaseLimit = function(segment){
            // Segment 0 is the first 1/3 of memory
            // Segment 1 is the second 1/3 of memory
            // Segment 2 is the third 1/3 of memory
            // Used to get base and limit
            if (segment === 0){
                var base = 0;
                var limit = (_DefaultMemorySize/3) - 1;
            }
            else if (segment === 1){
                var base = _DefaultMemorySize/3;
                var limit = ((_DefaultMemorySize/3) * 2) - 1;
            }
            else if (segment === 2){
                var base = ((_DefaultMemorySize/3) * 2);
                var limit = _DefaultMemorySize - 1;
            }
            
            return [base, limit];
        }
        
        // Since memory manager manages the segments, I'm guessing
        // it manages resident queue, as well?
        // I have no clue 
        MemoryManager.prototype.updateResQTable = function(){
            for (var i = 0; i < 3; i++){
                if (_readyQueue[i] === undefined){
                    document.getElementById("ready" + i).innerHTML = '-';
                } else {
                    document.getElementById("ready" + i).innerHTML = _readyQueue[i];
                }
            }
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

