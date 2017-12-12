///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date.")
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays where you are.")
            this.commandList[this.commandList.length] = sc;
            // whoareyou
            sc = new TSOS.ShellCommand(this.shellWhoAreYou, "whoareyou", "- Answers who I am.")
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Set the status")
            this.commandList[this.commandList.length] = sc;
            // panic
            sc = new TSOS.ShellCommand(this.shellPanic, "panic", "- Triggers blue screen of death.");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Displays PIDs in ready queue.");
            this.commandList[this.commandList.length] = sc;
            // getschedule
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "- Displays schedule in use.");
            this.commandList[this.commandList.length] = sc;
            // setschedule <string>
            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "- Sets schedule; Default is round-robin.");
            this.commandList[this.commandList.length] = sc;
            // quantum <int>
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- Sets quantum; Default is 6.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads the user program input.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Runs a program in memory.");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Runs all programs in ready queue.");
            this.commandList[this.commandList.length] = sc;
            // kill <pid> 
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kills a program that is running.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clears memory.");
            this.commandList[this.commandList.length] = sc;
            // format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Formats hard drive.");
            this.commandList[this.commandList.length] = sc;
            // ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "- Lists all files on hard drive.");
            this.commandList[this.commandList.length] = sc;
            // create <file_name>
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<file_name> - Creates a file on hard drive.");
            this.commandList[this.commandList.length] = sc;
            // read <file_name>
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<file_name> - Reads a file on hard drive.");
            this.commandList[this.commandList.length] = sc;
            // write <file_name> "data"
            sc = new TSOS.ShellCommand(this.shellWrite, "write", '<file_name> "data"- Writes to a file on hard drive.');
            this.commandList[this.commandList.length] = sc;
            // delete <file_name>
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", '<file_name> - Deletes a file on hard drive.');
            this.commandList[this.commandList.length] = sc;
            
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellWhereAmI = function(args){
            _StdOut.putText("You are in a cube.");
        };
        Shell.prototype.shellWhoAreYou = function(args){
            _StdOut.putText("I am Yu and he is Mi.");
        };
        Shell.prototype.shellDate = function(args){
            // Outputs date to canvas
            _StdOut.putText(Date());
            document.getElementById("date").innerHTML = "Date: " + Date()
            /*_StdOut.putText((date.getMonth() + 1) + '/'
                             + date.getDay() + '/'
                             + date.getYear() + ' '
                             + date.getHours() + ':'
                             + date.getMinutes() + ':'
                             + date.getSeconds() + ':'
                             + date.getMilliseconds());*/
        };
        Shell.prototype.shellStatus = function(args){
            // Outputs status to status message on page
            // Checks if there are arguments to change status to
            if (args.length < 1) {
                _StdOut.putText("Usage: status <string> Please input a string.")
            }
            else{
                var i = 0;
                var status = '';
                // Allows multiple word status
                while (i < (args.length)){
                    status = status + ' ' + args[i];
                    i = i + 1;
                }
                // Changes status on index.html page
                _Status = status;
                document.getElementById("status").innerHTML = _Status;
                _StdOut.putText("Status is set to: " + _Status);
            }
        };
        Shell.prototype.shellPanic = function(args){
            // Triggers blue screen of death
            _Kernel.krnTrapError('User initiated')
        };
        Shell.prototype.shellLoad = function(args){
            // Loads a user inputted program
            var opCodes = document.getElementById("taProgramInput").value;
            
            // Regex pattern for hex code
            // Breakdown:
            // ^ Look for inverse
            // a-fA-F0-9 Verify it's hex
            // Spaces and returns(\n) are acceptable
            // |->Makes copy paste easier
            var pattern = new RegExp("^[a-fA-F0-9 \n]+$");
            
            var isHex = pattern.test(opCodes);
            
            if (isHex) {
                console.log(_readyQueue + " Ready queue");
                if (_readyQueue.getSize() < _MaxProcesses){
                    // Create a new PCB
                    _PCB = new TSOS.PCB(_PID);
                    
                    // Add PCB to ready and resident queue
                    _readyQueue.enqueue(_PCB.PID);
                    _residentQueue.enqueue(_PCB);
                    
                    _segNumber++;
                    
                    _PCB.active = 'Ready';
                    
                    console.log("Created new PCB: " + _PCB);
                    console.log("Available PIDs: " + _scheduler.getAvailablePIDS());
                    console.log("Resident Queue updated: " + _residentQueue.toString());
                    console.log("Ready Queue: " + _readyQueue.toString());
                    
                    // Write opcodes to memory
                    _MemoryManager.write(opCodes);
                    
                    // Tell user the PID thats loaded
                    _StdOut.putText("Program with PID " + _PID + " Loaded.")
                    
                    // Increment PID
                    _PID = _PID + 1;
                    
                    // Updates HTML PCB Table
                    _PCB.updatePCBTable();
                    
                    _MemoryManager.updateResQTable();
                }
                else {
                    var hdPCB = new TSOS.PCB(_PID);
                    
                    _waitingQueue.enqueue(hdPCB.PID);
                    _residentQueue.enqueue(hdPCB);
                    
                    hdPCB.active = 'Waiting';
                    
                    hdPCB.loc = 'HDD';
                    
                    _krnfsDDDriver.krnfsDDCreateFile(_PID.toString());
                    
                    _krnfsDDDriver.krnfsDDEditFile(_PID.toString(), opCodes.replace(/ /g,''));
                    
                    // Tell user the PID thats loaded
                    _StdOut.putText("Program with PID " + _PID + " Loaded.");
                    
                    // Increment PID
                    _PID = _PID + 1;
                    
                    _hdd.updateHDDTable();
                }
            }
            else{
                _StdOut.putText("Invalid user input code. Must be between a-f, A-F, or 0-9. HEX CODE ONLY!")
            }
            
        };
        Shell.prototype.shellRun = function(args){
            // Runs the input process
            var found = false;
            if (args.length < 1) {
                _StdOut.putText("Usage: run <pid> Please input a pid.");
            }
            
            // See if PID is in Ready queue
            for (var i = 0; i < _readyQueue.getSize(); i++){
                if (args[0] == _readyQueue.q[i]){
                    found = true;
                    // Store the running PID
                    var activePID = i;
                }
            }
            
            if (_CPU.isSingleStep === false){
                if (found != true){
                    _StdOut.putText("Please enter a valid PID.")
                    
                }else{
                    _StdOut.putText("Running process: " + args[0]);
                    var resQIndex = -1;
                    var found = false;
                    for (var i = 0; i < _residentQueue.getSize(); i++){
                        if (_residentQueue.q[i].PID == activePID){
                            resQIndex = i;
                            found = true;
                        }
                    }
                    if(found){ //TODO: I think there is an issue here somewhere
                        // Segment of memory
                        _PCB = _residentQueue.q[resQIndex];
                        _PCB.updatePCBTable();
                    }
                    else{
                        console.log('PCB not found in resident queue.');
                    }
                    _isRun = true;
                    console.log('isRun set to ' + _isRun);
                    _CPU.cycle();
                    
                    // TODO: After a program finishes, erase it from the ready queue 
                    // OR Reset program counter back to 0
                    // Don't need this, I kill program in a break statement
                    //_readyQueue.q.splice(_readyQueue.q.indexOf(_PCB.PID), 1);
                }
            }else{
                if (found != true){
                    _StdOut.putText("Please enter a valid PID.")
                    
                }else{
                    _StdOut.putText("Running process:" + args[0]);
                }
            }
            
        };
        Shell.prototype.shellRunall = function(args){
            // Runs all processes in ready queue
            _PCB = _residentQueue.q[0];
            _CPU.cycle()
            
        };
        Shell.prototype.shellKill = function(args){
            // Kills a process that is executing
            // kill <pid>
            if (args.length < 1 || args.length > 1){
                _StdOut.putText("Usage: kill <pid> Please input an valid PID.")
            }
            else{
                _scheduler.killProcess(args[0]);
            }
        };
        Shell.prototype.shellClearmem = function (args){
            // Clears memory
            _Memory.clearMem(0, _DefaultMemorySize);
            _MemoryManager.updateMemTable();
            _readyQueue.q = [];
            _residentQueue.q = [];
            _segNumber = 0;
            _MemoryManager.updateResQTable();

        };
        Shell.prototype.shellQuantum = function (args){
            var intPatt = new RegExp("[0-9]+");
            
            if (args.length < 1 || !intPatt.test(args[0])) { // Make sure user entered a quantum thats an int
                _StdOut.putText("Usage: quantum <int> Please input an int.")
            }
            else {  // Sets quantum
                _scheduler.quantum = args[0];
                console.log("Quantum changed to " + args[0]);
            }
        };
        Shell.prototype.shellPs = function (args){
            _StdOut.putText('Available PIDS: ' + _scheduler.getAvailablePIDS());
        };
        Shell.prototype.shellSetSchedule = function (args){
            if (args.length < 1 || args.length > 1){
                _StdOut.putText('Usage: setschedule <string> Please input a string'); 
            }
            else{
                // TODO: Change this to a list that is saved in globals
                //  args[0] in scheduleModes
                if (args[0] === 'rr' || args[0] === 'fcfs' || args[0] === 'priority'){
                    _scheduler.mode = args[0];
                    _StdOut.putText('Schedule set to ' + _scheduler.mode);                    
                }
                else{
                    _StdOut.putText('Usage: setschedule <string> Please use a valid mode');
                    _StdOut.advanceLine();
                    _StdOut.putText('[rr, fcfs, priority]');
                }
            }
            
        };
        Shell.prototype.shellGetSchedule = function (args){
            if (args.length > 0){
                _StdOut.putText('Usage: getschedule (Please do not enter parameters)'); 
            }
            else{
                console.log(args);
                _StdOut.putText('Schedule set to ' + _scheduler.mode);
            }
            
        };
        Shell.prototype.shellFormat = function (args){
            if (args.length > 0){
                _StdOut.putText('Usage: format (Please do not enter parameters)'); 
            }
            else{
                _krnfsDDDriver.krnfsDDFormat();
                _hdd.updateHDDTable();
                _StdOut.putText("Hard drive formatted.");
                _StdOut.advanceLine();
            }
            
        };
        Shell.prototype.shellLs = function (args){
            if (args.length > 0){
                _StdOut.putText('Usage: ls'); 
            }
            else{
                var file_list = _krnfsDDDriver.krnfsDDListFiles();
                
                if (file_list.length > 0){
                    var j = 0;
                    console.log(file_list.length);
                    while (j < file_list.length){
                        _StdOut.putText('- ' + file_list[j])
                        _StdOut.advanceLine()
                        _StdOut.clearLine()
                        j++;
                    }
                    
                }
            }
            
        };
        Shell.prototype.shellCreate = function (args){
            if (args.length !== 1){
                _StdOut.putText('Usage: create <file_name>'); 
            }
            else{
                if (args[0].length <= _fileNameSize){
                    wasCreated = _krnfsDDDriver.krnfsDDCreateFile(args[0]);
                    if (wasCreated != false){
                        _StdOut.putText('File ' + args[0] + ' created!');
                    }
                } else {
                    _StdOut.putText("File name to long for this cube! Max length is " + _fileNameSize + " characters.");
                }
            }
        };
        Shell.prototype.shellRead = function (args){
            if (args.length !== 1){
                _StdOut.putText('Usage: read <file_name>'); 
            }
            else{
                if (args[0].length <= _fileNameSize){
                    fileOutput = _krnfsDDDriver.krnfsDDReadFile(args[0]);
                    
                    if(fileOutput != false){
                        _StdOut.putText(fileOutput);
                        _StdOut.advanceLine();
                    } else{
                        _StdOut.putText("File " + args[0] + " unsuccessfully read!");
                        _StdOut.advanceLine();
                        _StdOut.putText("Read console for more info.");
                        _StdOut.advanceLine();
                    }
                } else {
                    _StdOut.putText("Invalid file name!");
                }
            }
        };
        Shell.prototype.shellWrite = function (args){
            if (args.length === 0){
                _StdOut.putText('Usage: write <file_name> "data"'); 
            }
            else{
                // args[0] = file_name
                // args[1+] = data
                var file_name = args[0];
                var data = '';
                
                var i = 1;
                while(i < args.length){
                    data += args[i] + " ";
                    i += 1;
                }

                file_name = file_name.trim();
                data = data.trim().replace(/"/g, "");

                if (file_name.length <= _fileNameSize){
                    if(_krnfsDDDriver.krnfsDDEditFile(file_name.toString(), data.toString())){
                        _StdOut.putText("File " + file_name + " edited!");
                    } else {
                        _StdOut.putText("File " + file_name + " unsuccessfully edited!");
                        _StdOut.advanceLine();
                        _StdOut.putText("Read console for more info.");
                        _StdOut.advanceLine();
                    }
                } else {
                    _StdOut.putText("Invalid file name!");
                }
            }
        };
        Shell.prototype.shellDelete = function (args){
            if (args.length !== 1){
                _StdOut.putText('Usage: read <file_name>'); 
            }
            else{
                if (args[0].length <= _fileNameSize){
                    isDeleted = _krnfsDDDriver.krnfsDDDeleteFile(args[0]);
                    if(!isDeleted){
                        _StdOut.putText("File deleted from cube!");
                    } else{
                        _StdOut.putText("File not found.") // Must be a pyramid.
                    }
                } else {
                    _StdOut.putText("Invalid file name!");
                }
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
