///<reference path="../globals.js" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting, isSingleStep) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "--";}
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (isSingleStep === void 0) { isSingleStep = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.isSingleStep = isSingleStep;
        }
        
        // Initializes CPU
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.isSingleStep = false;
        };
        
        // Updates CPU table on index.html
        Cpu.prototype.updateCPUTable = function () {
            document.getElementById("cpuPC").innerHTML = _PCB.program_counter;
            document.getElementById("cpuIR").innerHTML = _PCB.IR;
            document.getElementById("cpuAcc").innerHTML = _PCB.acc;
            document.getElementById("cpuX").innerHTML = _PCB.X;
            document.getElementById("cpuY").innerHTML = _PCB.Y;
            document.getElementById("cpuZ").innerHTML = _PCB.Z;
        };
        
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            _PCB.active = 'Executing';
            // "rqPID:" +_residentQueue.q[i].PID
            document.getElementById("act" + _PCB.PID).innerHTML = 'Executing';
            /*for (var i = 0; i < _residentQueue.getSize(); i++){
                if(_residentQueue.q[i].PID === _PCB.PID){
                    console.log("here --");
                    _residentQueue.q[i].active = 'Executing'
                    _MemoryManager.updateResQRows();
                    break;
                }
            }*/
            
            
            _progCounter++;
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //if(this.isSingleStep === false){
            this.isExecuting = true;
            
            //}
            var isDone = false;
            
            // I got back to late, now I realize this is redundant
            // TODO: Fix to run without isDone in Proj 3
            if (isDone) {
                //this.isExecuting = false;
                
                _Console.advanceLine();
                _StdOut.putText(">");
            }
            else {
                // Get PCB's current base limit
                //var baseLimit = _MemoryManager.getBaseLimit(_readyQueue.indexOf(_PCB.PID));
                //var base = baseLimit[0];
                //var limit = baseLimit[1];
                var base = _PCB.base;
                var limit = _PCB.limit;
                
                /*
                Remember that issue with my jumps?
                Yea, this is a work around for that...
                Somewhere I am changing the program counter
                to the new location + base, but the rest of my 
                op codes are adding the base to the program counter
                */
                if (_PCB.program_counter > 256){
                    _PCB.program_counter = _PCB.program_counter - 256;
                    console.log("Work around used, new counter: " + _PCB.program_counter);
                }
                if ((_PCB.program_counter + base) > _Memory.bytes.length){
                    isDone = true;
                    //this.isExecuting = false;
                    
                    //var currPIDLocInRQ = _readyQueue.q.indexOf(_PCB.PID);
                    //_readyQueue.q.splice(currPIDLocInRQ, 1);
                    _StdOut.putText("To many bytes in memory or no break at end of code. You can not leave your cube! Execution killed.");
                    _scheduler.killProcess(_PCB.PID);
                    _Console.advanceLine();
                    _StdOut.putText(">");
                }
                
                // Update IR
                _PCB.IR = _Memory.bytes[_PCB.program_counter + base];
                
                console.log("PCB IR is " + _PCB.IR);
                
                // Change PCB active
                _PCB.active = 'Running';
                
                // Switch to handle 6502 op codes
                switch(_Memory.bytes[_PCB.program_counter].toUpperCase()){
                    // HEX ALPLHABET
                    // 0 1 2 3 4 5 6 7 8 9 A B C D E F 10 11
                    // Change should be in cpu not pcb
                    // TODO: Change all _PCB changes to CPU changes 
                    // |-> I think I may change this to just a display thing if anything b/c I like the PCB being constantly updated
                    // TODO: When reading a byte in memory change to a function in memory.js
                    // TODO: When changing memory bytes, should be a function in memory.js
                    // |-> Umm..I'm gonna get Proj 3 working first, will cleanup eventually

                    case 'A9':
                        // Load acc with constant
                        // Skip the A9, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Load acc with constant
                        _PCB.acc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Pass constant
                        _PCB.program_counter += 1;
                        
                        break;
                    case 'AD':
                        // Load acc from memory
                        
                        // Skip the AD, we know what it is
                        _PCB.program_counter += 1;
                        
                        var hexloc;
                        var loc;
                        
                        // Get hex location from memory
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        hexloc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Translate string hex to an int
                        loc = parseInt(hexloc, 16) + base;
                        
                        // Load accumulator from location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        _PCB.acc = _Memory.bytes[loc];
                        //console.log("ACC: " + _PCB.acc + " MEM: " + _Memory.bytes[loc]);
                        
                        // Increment pointer past location
                        _PCB.program_counter += 2;
                        
                        break;
                    case '8D':
                        //Store acc in memory
                        
                        var hexloc;
                        var loc;
                        var loc2;
                        
                        // Skip the 8D, whe know what it is
                        _PCB.program_counter += 1;
                        
                        // Get memory location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        hexloc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Translate string hex to a decimal int
                        loc = parseInt(hexloc, 16) + base; 
                        
                        // Increment pointer past first location to check for 00
                        _PCB.program_counter += 1;
                        
                        // Gets second location hex value
                        loc2 = _Memory.bytes[_PCB.program_counter + base];
                        
                        // TODO:Proj 3 - Change 255 to limit
                        // Verify location is available to this program
                        // loc2 can only be 00 for proj 2 b/c FF = 255
                        if ((loc > limit) || (loc < base) || loc2 != '00'){
                            _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                            //this.isExecuting = false;
                            
                            this.isDone = true;
                            _StdOut.advanceLine();
                            _StdOut.putText(">");
                        }
                        else {
                            // Store accumulator in 
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            _Memory.bytes[loc] = _PCB.acc;
                            
                        }
                        
                        // Increment pointer past last part of location
                        _PCB.program_counter += 1;
                        
                        break;
                    case '6D':
                        // Adds contents of address to acc,
                        // keeps result in acc
                        
                        var hexloc;
                        var loc;
                        var locNum;
                        var currAcc;
                        var added;
                        var res;
                        
                        // Stores accumulator at current state
                        currAcc = _PCB.acc;
                        
                        // Skip the 6D, whe know what it is
                        _PCB.program_counter += 1;
                        
                        // Get memory location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        hexloc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Translate string hex to an int
                        loc = parseInt(hexloc, 16) + base; 
                        
                        // Increment pointer past first location to check for 00
                        _PCB.program_counter += 1;
                        
                        // Gets second location hex value
                        loc2 = _Memory.bytes[_PCB.program_counter + base];
                        
                        // TODO:Proj 3 - Change 255 to limit
                        // Verify location is available to this program
                        // loc2 can only be 00 for proj 2 b/c FF = 255
                        if ((loc > limit) || (loc < base) || loc2 != '00'){
                            _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                            _Console.advanceLine();
                            _StdOut.putText(">");
                            //this.isExecuting = false;
                            
                            this.isDone = true;
                        }
                        else {
                            // Gets the number at the location in memory
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            locNum = _Memory.bytes[loc];
                            
                            // Adds number from memory to accumulator
                            added = parseInt(currAcc) + parseInt(locNum);
                            
                            if (added < 10){
                                res = '0' + added;
                            }else{
                                res = added.toString(16);
                            }
                            
                            // Stores in current accumulator
                            _PCB.acc = res;
                            
                            // Increment pointer past last location
                            _PCB.program_counter += 1;
                        }
                        
                        
                        break;
                    case 'A2':
                        // Load X reg with constant
                        
                        // Skip the A2, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Load X register with contant
                        _PCB.X = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Skip constant
                        _PCB.program_counter += 1;
                        
                        break;
                    case 'AE':
                        // Load X reg from memory
                        var hexloc;
                        var loc;
                        var locNum;
                        
                        // Skip AE, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Get memory location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        hexloc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Translate string hex to an int
                        loc = parseInt(hexloc, 16) + base; 
                        
                        // Increment pointer past first location to check for 00
                        _PCB.program_counter += 1;
                        
                        // Gets second location hex value
                        loc2 = _Memory.bytes[_PCB.program_counter + base];
                        
                        // TODO:Proj 3 - Change 255 to limit
                        // Verify location is available to this program
                        // loc2 can only be 00 for proj 2 b/c FF = 255
                        if ((loc > limit) || (loc < base) || loc2 != '00'){
                            _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                            //this.isExecuting = false;
                            
                            this.isDone = true;
                            _StdOut.advanceLine();
                            _StdOut.putText(">");
                        }
                        else{
                            // Gets the number at the location in memory
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            locNum = _Memory.bytes[loc];
                            
                            // Load X reg
                            _PCB.X = locNum
                            
                            // Increment pointer past last location
                            _PCB.program_counter += 1;
                        }
                        
                        break;
                    case 'A0':
                        // Load Y reg with constant
                        
                        // Skip the A0, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Load Y reg with constant
                        _PCB.Y = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Skip constant
                        _PCB.program_counter += 1;
                        
                        break;
                    case 'AC':
                        // Load Y reg from memory
                        
                        var hexloc;
                        var loc;
                        var locNum;
                        
                        // Skip AE, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Get memory location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        hexloc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Translate string hex to an int
                        loc = parseInt(hexloc, 16) + base; 
                        
                        // Increment pointer past first location to check for 00
                        _PCB.program_counter += 1;
                        
                        // Gets second location hex value
                        loc2 = _Memory.bytes[_PCB.program_counter + base];
                        
                        // TODO:Proj 3 - Change 255 to limit
                        // Verify location is available to this program
                        // loc2 can only be 00 for proj 2 b/c FF = 255
                        if ((loc > limit) || (loc < base) || loc2 != '00'){
                            _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                            //this.isExecuting = false;
                            return 'done'
                            this.isDone = true;
                            _StdOut.advanceLine();
                            _StdOut.putText(">");
                        }
                        else{
                            // Gets the number at the location in memory
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            locNum = _Memory.bytes[loc];
                            
                            // Load X reg
                            _PCB.Y = locNum;
                            
                            // Increment pointer past last location
                            _PCB.program_counter += 1;
                        }
                        
                        break;
                    case 'EA':
                        // No op
                        
                        // Just skip EA - there's no op on it
                        _PCB.program_counter += 1;
                        
                        break;
                    case '00':
                        // Break/system call
                        // Ends program
                        // Only adds 1, program is killed in scheduler
                        _PCB.program_counter += 1;
                        //_scheduler.killProcess(_PCB.PID);
                        /*
                        var indOfPID = _readyQueue.q.indexOf(_PCB.PID);
                        _readyQueue.q.splice(indOfPID, 1);
                        console.log("BREAK: removed " + _PCB.PID + " from ready queue.")
                        
                        for (var i = 0; i < _residentQueue.getSize(); i++){
                            if (_residentQueue.q[i].PID == _PCB.PID){
                                _residentQueue.q.splice(i,1);
                                console.log("BREAK: removed " + _PCB.PID + " from resident queue.")
                                break;
                            }
                        }*/
                        _PCB.active = 'Complete';
                        _StdOut.advanceLine();
                        _StdOut.putText('>');
                        break;
                    case 'EC':
                        // Compare byte in memory to X reg,
                        // Sets Z flag to 0 if equal
                        
                        var loc;
                        var locNum;
                        var xReg;
                        
                        // Skip EC, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Get memory location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        hexloc = _Memory.bytes[_PCB.program_counter + base];
                        
                        // Translate string hex to an int
                        loc = parseInt(hexloc, 16) + base; 
                        
                        // Increment pointer past first location to check for 00
                        _PCB.program_counter += 1;
                        
                        // Gets second location hex value
                        loc2 = _Memory.bytes[_PCB.program_counter + base];
                        
                        // TODO:Proj 3 - Change 255 to limit
                        // Verify location is available to this program
                        // loc2 can only be 00 for proj 2 b/c FF = 255
                        if ((loc > limit) || (loc < base) || loc2 != '00'){
                            _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                            //this.isExecuting = false;
                            
                            this.isDone = true;
                            _StdOut.advanceLine();
                            _StdOut.putText(">");
                        }
                        else {
                            // Gets the number at the location in memory
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            locNum = _Memory.bytes[loc];
                            
                            // Gets number in X register decimal value
                            xReg = parseInt(_PCB.X, 16);
                            //_StdOut.putText("X: " + xReg + " locNum: " + locNum);
                            // Compare xReg to number in memory
                            if (xReg == locNum){
                                _PCB.Z = 1; // 0 if same
                            } 
                            else {
                                _PCB.Z = 0;
                            }
                            
                            // Increment pointer past last location
                            _PCB.program_counter += 1;
                        }
                        
                        break;
                    case 'D0':
                        // Branch n bytes if Z flag = 0
                        
                        var n;
                        var hexn;
                        
                        // Skip D0, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Check Z flag and branch
                        if (_PCB.Z == 0){
                            // Get memory location
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            hexn = _Memory.bytes[_PCB.program_counter + base];
                        
                            // Translate string hex to an int
                            n = parseInt(hexn, 16);
                            var newloc = parseInt(_PCB.program_counter) + n;
                            if (newloc < limit){
                                if (_PCB.segment > 0){
                                    //console.log("Before: " + newloc);
                                    //newloc++;
                                    //console.log("Added 1 to newloc: " + newloc);
                                    console.log("newloc: " + newloc);
                                }
                                _PCB.program_counter = newloc + 1;
                            } else{
                                //console.log("nah here");
                                _PCB.program_counter = newloc - limit;
                            }
                            console.log("Program counter: " + _PCB.program_counter);
                            
                        } else{
                            _PCB.program_counter += 1;
                        }
                        
                        break;
                    case 'EE':
                        // Increment the value of a byte
                        
                        var incNum;
                        var loc;
                        var locNum;
                        
                        // Skip EE
                        _PCB.program_counter += 1;
                        
                        // Get memory location
                        // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                        // This is a work around for jumps
                        // Jumps are changing the program counter to above 256
                        if (_PCB.program_counter < 256){
                            hexloc = _Memory.bytes[_PCB.program_counter + base];
                        }
                        else{
                            hexloc = _Memory.bytes[_PCB.program_counter];
                        }
                        
                        // Translate string hex to an int
                        loc = parseInt(hexloc, 16) + base; 
                        
                        // Increment pointer past first location to check for 00
                        _PCB.program_counter += 1;
                        
                        // Gets second location hex value
                        loc2 = _Memory.bytes[_PCB.program_counter + base];
                        
                        // TODO:Proj 3 - Change 255 to limit
                        // Verify location is available to this program
                        // loc2 can only be 00 for proj 2 b/c FF = 255
                        if ((loc > limit) || (loc < base) || loc2 != '00'){
                            _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                            _StdOut.putText(">");
                            //this.isExecuting = false;
                            _scheduler.killProcess(_PCB.PID);
                            this.isDone = true;
                            _StdOut.advanceLine();
                        }
                        else {
                            // Gets the number at the location in memory
                            // in decimal form
                            // CHANGE THIS SO ITS A MEMORY MANAGER FUNCTION
                            locNum = parseInt(_Memory.bytes[loc], 16);
                            
                            // Increment value of byte
                            incNum = locNum + 1;
                            
                            // Place number back in memory as a hex value
                            _Memory.bytes[loc] = incNum.toString(16);
                            
                            // Skip location
                            _PCB.program_counter += 1;
                        }
                        break;
                    case 'FF':
                        // System call
                        // Prints to console
                        // Check X reg for 01
                        // |->print integer stored in Y reg
                        // Check X reg for 02
                        // |-> print the 00-terminated string 
                        // |-> stored at the address in the Y register.
                        
                        // Skip FF
                        _PCB.program_counter += 1;
                        
                        // Check X reg for 01
                        if ( _PCB.X == "01") {
                            // Print int stored in Y reg
                            _StdOut.putText(_PCB.Y);
                            _Console.advanceLine();
                        }
                        else if (_PCB.X == "02") {
                            // Print text until "00"
                            var loc = parseInt(_PCB.Y, 16) + base;
                            
                            var terminated = false;
                            var inByte;
                            var fullStr = '';
                            if (loc < limit && loc > base){
                                while(terminated === false){
                                    // ISSUE here?
                                    // Get current byte
                                    inByte = _Memory.bytes[loc];
                                    
                                    // 00 terminates string
                                    if (inByte == '00'){
                                        terminated = true;
                                    }else{
                                        // Get the full string in characters
                                        var charCode = parseInt(inByte, 16);
                                        _StdOut.putText(String.fromCharCode(charCode));
                                        //fullStr += String.fromCharCode(charCode);
                                    }
                                    loc += 1;
                                }
                            }
                            else{
                                _StdOut.putText("Invalid memory access, You can not leave your cube! Killing program.");
                                //this.isExecuting = false;
                                _scheduler.killProcess(_PCB.PID);
                                this.isDone = true;
                                _StdOut.advanceLine();
                                _StdOut.putText(">");
                            }
                            
                            //_StdOut.putText(fullStr);
                            //_Console.advanceLine();
                        }
                        break;
                    default:
                        console.log('Not an op code:' + _Memory.bytes[_PCB.program_counter + base].toUpperCase())
                        //this.isExecuting = false;
                        _StdOut.putText(_Memory.bytes[_PCB.program_counter + base] + " is not a valid 6502 op code, don't try to break your cube. Execution killed");
                        _scheduler.killProcess(_PCB.PID);
                        _Console.advanceLine();
                        _StdOut.putText(">");
                    
                }
                
            }
            _MemoryManager.updateResQRows();
            _PCB.updatePCBTable();
            _CPU.updateCPUTable();
        };

        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
