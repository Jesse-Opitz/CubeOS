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
            //var segment = _segNumber % 3; -- Old
            var segment = _PCB.segment; //this.getMemSegment();
            
            // Gets tuple of base and limit
            //var baseLimit = this.getBaseLimit(segment);
            
            var base = _PCB.base;
            var limit = _PCB.limit;
            
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
        };
        
        // clearResQTable
        MemoryManager.prototype.removeResQRow = function(pid){
            // remove row "rqPID:" +_residentQueue.q[i].PID
            var row = document.getElementById("rqPID:" + pid);
            row.parentNode.removeChild(row);
        };
        
        MemoryManager.prototype.updateResQRows = function (){
            var tblBody = document.getElementById("rqTble");
            
            // creating all cells
            for (var i = 0; i < _residentQueue.getSize(); i++) {
                //console.log("Here: " + _resQTable.indexOf(_residentQueue.q[i].PID) >= 0)
                //console.log("Here: " + _resQTable.indexOf(_residentQueue.q[i].PID))
                if(_resQTable.indexOf(_residentQueue.q[i].PID) === -1){
                    // creates a table row
                    var row = document.createElement("tr");
                    var pidCell = document.createElement("td");
                    var pid = document.createTextNode(_residentQueue.q[i].PID);
                    
                    var actCell = document.createElement("td");
                    var active = document.createTextNode(_residentQueue.q[i].active);
                    
                    var locCell = document.createElement("td");
                    var location = document.createTextNode(_residentQueue.q[i].loc);
                    
                    pidCell.appendChild(pid);
                    pidCell.setAttribute("id", "pid" + _residentQueue.q[i].PID);
                    
                    actCell.appendChild(active);
                    actCell.setAttribute("id", "act" + _residentQueue.q[i].PID);
                    
                    locCell.appendChild(location);
                    locCell.setAttribute("id", "loc" + _residentQueue.q[i].PID);
                    
                    row.setAttribute("id", "rqPID:" +_residentQueue.q[i].PID)
                    
                    row.appendChild(pidCell);
                    row.appendChild(actCell);
                    row.appendChild(locCell);
     
                    // add the row to the end of the table body
                    tblBody.appendChild(row);
                    
                    _resQTable.push(_residentQueue.q[i].PID);
                }
            }
            
            //document.getElementById("rqHead").setAttribute("colspan", _residentQueue.q.length);
        };
        MemoryManager.prototype.createResQTable = function(){
            var body = document.getElementById("divReadyQueue");
            // creates a <table> element and a <tbody> element
            var tbl = document.createElement("table");
            var tblBody = document.createElement("tbody");
            tblBody.setAttribute("id", "rqTble");

            var tblHead = document.createElement("thead");
            var headRow = document.createElement("tr");
            var head = document.createElement("th");
            var headText = document.createTextNode("Ready Queue");
            
            head.setAttribute("colspan","3");
            head.setAttribute("style", "text-align:center;");
            head.setAttribute("id", "rqHead");
            
            head.appendChild(headText);
            headRow.appendChild(head);
            tblHead.appendChild(headRow);
            tbl.appendChild(tblHead);
            
            // creates a table row
            var row = document.createElement("tr");
            var pidCell = document.createElement("td");
            var pid = document.createTextNode("PID");
            
            var actCell = document.createElement("td");
            var active = document.createTextNode("Status");
            
            var locCell = document.createElement("td");
            var location = document.createTextNode("Location");
            
            pidCell.appendChild(pid);
            actCell.appendChild(active);
            locCell.appendChild(location);
            
            row.appendChild(pidCell);
            row.appendChild(actCell);
            row.appendChild(locCell);
            
            row.setAttribute("style", "font-weight: bold;")
            // add the row to the end of the table body
            tblBody.appendChild(row);

            //put the <thead> in the <table>
            //tbl.appendChild(tblHead);
            // put the <tbody> in the <table>
            tbl.appendChild(tblBody);
            // appends <table> into <body>
            body.appendChild(tbl);
            // sets the class to bootstrap settings
            tbl.setAttribute("class", "table table-bordered table-responsive");
        }
        
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

