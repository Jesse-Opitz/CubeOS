/* ------------
     scheduler.js

     CPU Scheduler, performs in round robin

------------ */
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(quantum, mode, isActive) {
            if (quantum === void 0) {quantum = 6;}
            if (mode === void 0) {mode = 'round-robin';}
            if (isActive === void 0) {isActive = false;}
            
            this.quantum = quantum;
            this.mode = mode;
            this.isActive = isActive;
        }
        
        Scheduler.prototype.cycle = function (){
            // Scheduler cycle event
            // Project 4 has multiple scheduling schemes.
            // This allows capability for that. 
            switch (this.mode){
                case 'round-robin':
                    this.roundRobin();
                    break;
                default:
                    this.roundRobin();
                    break;
            }
        };
        
        Scheduler.prototype.contextSwitch = function (){
            // Switch processess
            
            // Gets segment of new process
            //var tempSegment = _readyQueue.indexOf(newPID);
            
            // Changes PCB to the PCB of that new process
            //_PCB = _residentQueue[tempSegment];
            //_PCB = _residentQueue.q[segment];
            var oldPCB = _readyQueue.dequeue();
            if (_PCB.IR != '00'){
                _readyQueue.enqueue(_PCB);
                _PCB.active = 'Ready';
            }
            else{
                _PCB.active = 'Finished';
                for (var i = 0; i < _residentQueue.getSize(); i++){
                    if (_residentQueue.q[i].PID == _PCB.PID){
                        _residentQueue.q.splice(i, 1);
                    }
                }
                console.log("PCB Finished: " + _PCB);
                console.log("Current Resident Queue: " + _residentQueue.toString() + " PID Of 0: " + _residentQueue.q[0].PID);
                console.log("Current Ready Queue: " + _readyQueue.toString());
            }
            if (_readyQueue.getSize() > 0){
                var newPID = _readyQueue.q[0];
                for (var i = 0; i < _residentQueue.getSize(); i++){
                    if (_residentQueue.q[i].PID == newPID){
                        _PCB = _residentQueue.q[i];
                        break;
                    }
                }
            } else{
                _CPU.isExecuting = false;
            }
            
            
            console.log("New PCB: " + oldPCB);
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
            if (_progCounter >= this.quantum || _PCB.IR == '00'){
                this.contextSwitch();
                _progCounter = 0;
            }
            
        };

        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));