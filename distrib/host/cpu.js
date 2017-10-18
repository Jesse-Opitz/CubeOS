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
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "00";}
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            //if (isSingleStep === void 0) { isSingleStep = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            //this.isSingleStep = isSingleStep;
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
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.isExecuting = true;
            var isDone = false;
            
            if (isDone) {
                this.isExecuting = false;
            }
            else {
                switch(_Memory.bytes[_PCB.program_counter].toUpperCase()){
                    // HEX ALPLHABET
                    // 0 1 2 3 4 5 6 7 8 9 A B C D E F 10 11
                    case 'A9':
                        // Load acc with constant
                        
                        // Skip the A9, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Load acc with constant
                        _PCB.acc = _Memory.bytes[_PCB.program_counter];
                        
                        // Pass constant
                        _PCB.program_counter += 1;
                        
                        break;
                    case 'AD':
                        // Load acc from memory
                        
                        // Skip the AD, we know what it is
                        _PCB.program_counter += 1;
                        
                        // Get hex location from memory
                        hexloc = _Memory.bytes[_PCB.program_counter];
                        
                        // Translate string hex to an int
                        loc = 0;
                        
                        // Load accumulator from location
                        _PCB.acc = _Memory.bytes[loc];
                        
                        break;
                    case '8D':
                        //Store acc in memory
                        break;
                    case '6D':
                        // Adds contents of address to acc,
                        // keeps result in acc
                        break;
                    case 'A2':
                        // Load X reg with constant
                        break;
                    case 'AE':
                        // Load X reg from memory
                        break;
                    case 'A0':
                        // Load Y reg with constant
                        break;
                    case 'AC':
                        // Load Y reg from memory
                        break;
                    case 'EA':
                        // No op
                        break;
                    case '00':
                        // Break/system call
                        // Ends program
                        this.isExecuting = false;
                        break;
                    case 'EC':
                        // Compare byte in memory to X reg,
                        // Sets Z flag to 0 if equal
                        break;
                    case 'D0':
                        // Branch n bytes if Z flag = 0
                        break;
                    case 'EE':
                        // Increment the value of a byte
                        break;
                    case 'FF':
                        // System call
                        // Prints to console
                        // Check X reg for 01
                        // |->print integer stored in Y reg
                        // Check X reg for 02
                        // |-> print the 00-terminated string 
                        // |-> stored at the address in the Y register.
                        break;
                    default:
                        console.log('Not an op code:' + _Memory.bytes[_PCB.program_counter].toUpperCase())
                        // Should I bsod here?
                        console.log('This is not an op code or location. Should I bsod?')
                    
                }
                //console.log(_PCB.program_counter);
                //console.log(_Memory.bytes.length);
                if (_PCB.program_counter >= _Memory.bytes.length){
                    isDone = true;
                    console.log('There is no break at the end. Should I bsod?')
                }
            }
            _PCB.updatePCBTable();
            _CPU.updateCPUTable();
        };

        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
