/* ------------
     scheduler.js

     CPU Scheduler, performs in round robin

------------ */
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(quantum, mode, isActive, killPID) {
            if (quantum === void 0) {quantum = _quantum;}
            if (mode === void 0) {mode = 'round-robin';}
            if (isActive === void 0) {isActive = false;}
            if (killPID === void 0) {killPID = -1;}
            
            this.quantum = quantum;
            this.mode = mode;
            this.isActive = isActive;
            
            this.killPID = killPID;
        }
        
        Scheduler.prototype.killProcess = function (pid){
            for (var i = 0; i < _readyQueue.getSize();i++){
                if (_readyQueue.q[i].PID == pid){
                    var indexOfReadyQ = i;
                    console.log("Killing ready queue pid: " + _readyQueue.q[i]);
                }
            }
            
            for (var i = 0; i < _residentQueue.getSize(); i++){
                if (_residentQueue.q[i].PID == pid){
                    var indexOfResQ = i;
                    console.log("Killing resident queue pid: " + _residentQueue.q[i]);
                }
            }
            
            _readyQueue.q.splice(indexOfReadyQ, 1);
            _residentQueue.q.splice(indexOfResQ, 1);
        };
        
        Scheduler.prototype.cycle = function (){
            // Scheduler cycle event
            // Project 4 has multiple scheduling schemes.
            // This allows capability for that. 
            this.roundRobin();
            
        };
        
        Scheduler.prototype.contextSwitch = function (){
            // Switch processess
            console.log("Context Switch");
            console.log("PCB IR is " + _PCB.IR);
            // If the program breaks
            if (_PCB.IR == '00'){
                console.log("Found break");
                
                this.killProcess(_PCB.PID);
                //_readyQueue.q.splice(0,1);
                console.log("ready queue: " + _readyQueue.toString());
                // If there is no more programs left in the ready queue
                if (_readyQueue.getSize() == 0){ // Stop executing
                    console.log("Here: " + _readyQueue.getSize());
                    _CPU.isExecuting = false;
                    _scheduler.isActive = false;
                } else { // Go to the next PID
                    console.log("ready queue in else: " + _readyQueue.toString());
                    console.log("resident queue: " + _residentQueue.toString());
                    console.log("First or last in res q: " + _residentQueue.q[0].PID)
                    // Gets new PID
                    newPID = _readyQueue.q[0];
                    console.log("newPID: " + newPID);
                    // Updates _PCB to correct PCB
                    for (var i = 0; i < _residentQueue.getSize();i++){
                        if (_residentQueue.q[i].PID == newPID){
                            _PCB = _residentQueue.q[i];
                            console.log("New PCB: " + _residentQueue.q[i])
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
            
            _MemoryManager.updateResQTable();
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
            
            
            
        };

        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));