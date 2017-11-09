/* ------------
     scheduler.js

     CPU Scheduler, performs in round robin

------------ */
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(quantum, mode) {
            if (quantum === void 0) {quantum = 6;}
            if (mode === void 0) {mode = 'round-robin';}
            
            this.quantum = quantum;
            this.mode = mode;
        }
        
        Scheduler.prototype.cycle = function (){
            // Scheduler cycle event
            switch (this.mode){
                case 'round-robin':
                    this.roundRobin();
                    break;
                default:
                    this.roundRobin();
                    break;
            }
        };
        
        Scheduler.prototype.contextSwitch = function (newPID){
            // Switch processess
            
            // Gets segment of new process
            var tempSegment = _readyQueue.indexOf(newPID);
            
            // Changes PCB to the PCB of that new process
            _PCB = _residentQueue[tempSegment];
        };
        
        Scheduler.prototype.roundRobin = function (){
            // Implement round robin here
            
        };

        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));