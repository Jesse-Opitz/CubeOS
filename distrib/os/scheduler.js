/* ------------
     scheduler.js

     CPU Scheduler, performs in round robin

------------ */
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(quantum, mode, isActive, killPID) {
            if (quantum === void 0) {quantum = _quantum;}
            if (mode === void 0) {mode = 'rr';}
            if (isActive === void 0) {isActive = false;}
            if (killPID === void 0) {killPID = -1;}
            
            this.quantum = quantum;
            this.mode = mode;
            this.isActive = isActive;
            
            this.killPID = killPID;
        }
        
        Scheduler.prototype.killProcess = function (pid){
            for (var i = 0; i < _readyQueue.getSize();i++){
                if (_readyQueue.q[i] == pid){
                    //var indexOfReadyQ = i;
                    console.log("Killing ready queue pid: " + _readyQueue.q[i]);
                    _readyQueue.q.splice(i, 1);
                }
            }
            
            for (var i = 0; i < _residentQueue.getSize(); i++){
                if (_residentQueue.q[i].PID == pid){
                    //var indexOfResQ = i;
                    _MemoryManager.removeResQRow(pid);
                    console.log("Killing resident queue pid: " + _residentQueue.q[i]);
                    _residentQueue.q.splice(i, 1);
                }
            }
            
            console.log('Ready Queue: ' + _readyQueue.q.toString());
            console.log('Resident Queue: ' + _residentQueue.q.toString());
            _PCB.IR = '00';
            _CPU.IR = '00';
            
            if (_isRun){
                _CPU.isExecuting = false;
            }
        };
        Scheduler.prototype.getAvailablePIDS = function (){
            // Returns the list of all available PIDs
            var pids = [];
            
            for (var i = 0; i < _residentQueue.getSize(); i++){
                pids.push(_residentQueue.q[i].PID);
            }
            
            return pids;
        };
        
        Scheduler.prototype.cycle = function (){
            // Scheduler cycle event
            // Project 4 has multiple scheduling schemes.
            // This allows capability for that.
            // TODO: Add cube scheduling?
            switch(this.mode){
                case 'rr':
                    this.roundRobin();
                    break;
                case 'fcfs':
                    this.fcfs();
                    break;
                case 'priority':
                    this.priority();
                    break;
                default:
                    _StdOut.putText("Mode not set, using default (round-robin).")
                    this.roundRobin();
            }
            
        };
        Scheduler.prototype.rollIn = function (pid) {
            // Rolls a program into memory
            var newData = _krnfsDDDriver.krnfsDDReadFile(pid);
            
            // _PCB is the last used process
            base = _PCB.base;
            limit = _PCB.limit;
            lastUsedPID = _PCB.PID;
            for (var i = 0; i < _residentQueue.getSize();i++) {
                if(_residentQueue.q[i].PID === pid) {
                    _PCB = _residentQueue.q[i].PID;
                    _PCB.base = base;
                    _PCB.limit = limit;
                    _PCB.loc = 'Memory';
                    document.getElementById("loc" + pid).innerHTML = 'Memory';
                }
            }
            
            _Memory.write(newData);
        };
        
        Scheduler.prototype.rollOut = function(pid){
            // Roll out must go before roll in
            // Rolls program out to HDD
            _krnfsDDDriver.krnfsDDCreateFile(pid);
            
            for (var i = 0; i < _residentQueue.getSize();i++) {
                if(_residentQueue.q[i].PID === lastUsedPID) {
                    _residentQueue.q[i].loc = 'HDD';
                    document.getElementById("loc" + lastUsedPID).innerHTML = 'HDD';
                }
            }
            
            var oldData = '';
            for (var j = _PCB.base; j < _PCB.limit; j++){
                oldData += _Memory.bytes[j].toString();
            }
            
            _krnfsDDDriver.krnfsDDEditFile(_PCB.PID, oldData);
        };
        
        Scheduler.prototype.contextSwitch = function (){
            // Switch processess
            // Used for round robin and fcfs
            // fcfs - B/c of how ready queue is set up,
            //   this will automatically run fcfs
            // rr - Switch was originally set up for round-robin
            // 
            // TODO: **POSSIBILITY** Switch statement to do a specific
            //   context switch depending on the mode
            
            console.log("Context Switch");
            
            // If the program breaks
            if (_PCB.IR == '00'){
                console.log("Found break");
                
                this.killProcess(_PCB.PID);
                
                console.log("Ready queue: " + _readyQueue.toString());
                // If there is no more programs left in the ready queue
                if (_readyQueue.getSize() == 0){ // Stop executing
                    _CPU.isExecuting = false;
                    _scheduler.isActive = false;
                } else { // Go to the next PID
                    // Gets new PID
                    newPID = _readyQueue.q[0];
                    
                    // Updates _PCB to correct PCB
                    for (var i = 0; i < _residentQueue.getSize();i++){
                        if (_residentQueue.q[i].PID == newPID){
                            _PCB = _residentQueue.q[i];
                            //console.log("New PCB: " + _residentQueue.q[i])
                        }
                    }
                }
            } else{
                // Take old PID off the front of ready queue
                // Put it on the back of the queue
                var oldPID = _readyQueue.dequeue();
                
                _readyQueue.enqueue(oldPID);
                
                // Updates _PCB to correct PCB
                for (var i = 0; i < _residentQueue.getSize();i++){
                    if (_residentQueue.q[i].PID == _readyQueue.q[0]){
                        _PCB = _residentQueue.q[i];
                        break;
                    }
                }
            }
            
            //_MemoryManager.updateResQTable();
            _MemoryManager.updateResQRows();
            _PCB.updatePCBTable();
            
            _CPU.X = _PCB.X;
            _CPU.Y = _PCB.Y;
            _CPU.Z = _PCB.Z;
            _CPU.acc = _PCB.acc;
            _CPU.program_counter = _PCB.program_counter;
            _CPU.IR = _PCB.IR;
            
            _CPU.updateCPUTable();
        };
        
        Scheduler.prototype.roundRobin = function (){
            // Implements round robin scheduling
            // Check for single run or runall
            console.log("PID-:" + _PCB.PID + " Quantum: " + _progCounter);
            if ((_progCounter >= this.quantum || _PCB.IR == '00')){
                document.getElementById("act" + _PCB.PID).innerHTML = 'Ready';
                this.quantum = _quantum;
                if (_isRun){
                    console.log('isRun is '  + _isRun);
                    if (_PCB.IR == '00'){
                        _isRun = false;
                        _CPU.isExecuting = false;
                        this.killProcess(_PCB.PID);
                    }
                    
                }
                else{
                    console.log("PID: " + _PCB.PID);
                    console.log("Ready Queue: " + _readyQueue.q.toString())
                    this.contextSwitch();
                    _progCounter = 0;
                }
            }
            
            Scheduler.prototype.fcfs = function (){
                // First come first serve scheduling
                // TODO: Implement this.
                console.log("Running fcfs...");
                if (_PCB.IR == '00'){
                    this.contextSwitch();
                }
            };
            
            Scheduler.prototype.priority = function (){
                // Non-preemptive priority scheduling
                // TODO: Implement this.
                console.log("Running priority...");
            };
            
        };

        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));