///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

/* ----------------------------------
   fsDD.js

   Requires deviceDriver.js

   The File System Device Driver.
   
   This is the driver for new secondary storage devices.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var fsDD = (function (_super) {
        __extends(fsDD, _super);
        function fsDD() {
            // Override the base method pointers.
            _super.call(this, this.krnfsDDDriverEntry, this.krnUsingDisk);
        }
        fsDD.prototype.krnfsDDDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        };
        // TODO: Use interrupts with this function...
        fsDD.prototype.krnfsDDUsingDisk = function (args) {
            // Debating if I should use this...
            // May be best practice, but time is of the essence
            // Takes in a list of args
            // 0 - Operation to be done
            // 1 - blank or file_name
            
            console.log('Disk being used.');
            switch(args[0]){
                case 'krnfsDDFormat':
                    this.krnfsDDFormat();
                    break;
            }
        };
        fsDD.prototype.krnfsDDFormat = function () {
            // Sets disk to 0's 
            _Kernel.krnTrace('Formatting hard drive.');

            for (var t = 0; t < _hdd.tracks; t++){
                for (var s = 0; s < _hdd.sectors; s++){
                    for (var b = 0; b < _hdd.blocks; b++){
                        _hdd.zeroBlock(t, s, b);
                    }
                }
            }
            _hdd.formatted = true;
            console.log('Disk ' + _hdd.id + ' formatted: ' + _hdd.formatted);
            _Kernel.krnTrace('Hard drive formatted');
            
        };
        
        fsDD.prototype.krnfsDDCreateFile = function (file_name) {
            // Creates a file on disk
            var tsb = _hdd.getAvailableDirSpace();
            if (tsb != false){
                var t = tsb[0];
                var s = tsb[1];
                var b = tsb[2];
            } else{
                _StdOut.putText("Your directory cube is full.");
                return false;
            }
            
            _hdd.flipUseBit(t, s, b);
            data = JSON.parse(sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b));

            if (file_name.length <= _fileNameSize){
                _Kernel.krnTrace("Creating file " + file_name + " in TSB:" + t + ":" + s + ":" + b);
                console.log("Creating file " + file_name + " in TSB:" + t + ":" + s + ":" + b);
                
                for (var i = 0; i < file_name.length; i++){
                    charCode = file_name.charCodeAt(i);
                    data[i+2] = charCode;
                }
                
                // Write name in dir section
                _hdd.write(t, s, b, data);
                
                // Set chaining bit
                _hdd.setChainBit(t, s, b);
                
                console.log("New Data in " + t + ":" + s + ":" + b + ": " + sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b));
                
                _hdd.updateHDDTable();
                _Kernel.krnTrace("File " + file_name + " created in TSB:" + t + ":" + s + ":" + b);
            } else{
                _StdOut.putText("File name to long! Max length is " + _fileNameSize + " characters.");
                return false;
            }
            
        };
        fsDD.prototype.krnfsDDDeleteFile = function (file_name) {
            // Deletes a file on disk
            _Kernel.krnTrace("Deleting file " + file_name);
            console.log("Deleting file: " + file_name);
            //console.log("Deleting file " + file_name);
            var originTSB = _hdd.findFile(file_name);
            console.log("Origin TSB: " + originTSB);
            if (originTSB != false){
                var originT = originTSB[0];
                var originS = originTSB[1];
                var originB = originTSB[2];
                
                var nextChain = _hdd.getChainBit(originT, originS, originB);
                
                _hdd.zeroBlock(originT, originS, originB);
                
                while( nextChain[0] !== "00" || nextChain[0] !== "00" || nextChain[0] !== "00"){
                    var t = nextChain[0];
                    var s = nextChain[1];
                    var b = nextChain[2];
                    
                    nextChain = _hdd.getChainBit(parseInt(t), parseInt(s), parseInt(b));
                    //console.log("Next Chain: " + nextChain);
                    _hdd.zeroBlock(parseInt(t), parseInt(s), parseInt(b));
                    console.log("Deleting: " + parseInt(t) + ":" + parseInt(s) + ":" + parseInt(b));
                }
                _hdd.updateHDDTable();
                console.log(file_name + " successfully deleted.");
                _Kernel.krnTrace(file_name + " successfully deleted.");
            } else{
                return false;
            }
        };
        fsDD.prototype.krnfsDDListFiles = function () {
            // Lists all files on disk
            console.log("Listing files...");
            /*
                * DIR:  0 0 1 to
                * DIR:  0 7 7
            */
            var file_list = [];
            var t = 0;
            for (var s = 0; s < _hdd.sectors; s++){
                for (var b = 0; b < _hdd.blocks; b++){
                    if (b !== 0 || s !== 0){
                        if (!_hdd.checkUseBit(t, s, b)){
                            console.log("TSB:" + t + ":" + s + ":" + b);
                            var fn = '';
                            var uncleanData = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
            
                            var data = JSON.parse(uncleanData);
                            console.log(data[2]);
                            // Start at 2 to skip use-bit and extra bit
                            var i = 2;
                            while (i < _fileNameSize){
                                if(data[i] !== "00"){
                                    fn += String.fromCharCode(data[i]);
                                } else{
                                    break;
                                }
                                i++;
                            }
                            file_list.push(fn);
                        }
                    }
                }
            }
            return file_list;
        };
        
        return fsDD;
    })(TSOS.DeviceDriver);
    TSOS.fsDD = fsDD;
})(TSOS || (TSOS = {}));
