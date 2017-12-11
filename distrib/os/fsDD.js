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
            console.log('Disk being used.');
            switch(proc){
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
                        _hdd.write(t, s, b, JSON.stringify(_emptyBlock));
                    }
                }
            }
            _hdd.formatted = true;
            console.log('Disk ' + _hdd.id + ' formatted: ' + _hdd.formatted);
            _Kernel.krnTrace('Hard drive formatted');
            
        };
        fsDD.prototype.krnfsDDGetAvailableDirSpace = function (){
            // returns next free directory space
            /*
                * DIR:  0 0 1 to
                * DIR:  0 7 7
            */
            var t = 0;
            for (var s = 0; s < _hdd.sectors; s++){
                for (var b = 0; b < _hdd.blocks; b++){
                    console.log("S: " + s + " B: " + b);
                    if (b !== 0 || s !== 0){
                        if(_hdd.checkBit(t, s, b)){
                            return [t, s, b];
                        }
                    }
                }
            }
            return false;
        };
        fsDD.prototype.krnfsDDGetAvailableFileSpace = function (){
            // returns [track, sector, block] for next available
            // file space.
            /*
                * FILE: 1 0 0 to
                * FILE: 3 7 7
            */
            
            for (var t = 1; t < _hdd.tracks; t++){
                for (var s = 0; s < _hdd.sectors; s++){
                    for (var b = 0; b < _hdd.blocks; b++){
                        if(_hdd.checkBit(t, s, b)){
                            return [t, s, b];
                        }
                    }
                }
            }
            
            return false;
        };
        fsDD.prototype.krnfsDDCreateFile = function (file_name) {
            // Creates a file on disk
            var tsb = this.krnfsDDGetAvailableDirSpace();
            if (tsb != false){
                var t = tsb[0];
                var s = tsb[1];
                var b = tsb[2];
            } else{
                _StdOut.putText("Your directory cube is full.");
                return false;
            }
            //var t = 0;
            //var s = 0;
            //var b = 1;
            console.log("Looking at " + t + ":" + s + ":" + b);
            _hdd.flipBit(t, s, b);
            data = JSON.parse(sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b));
            console.log('HERE' + data[0]);
            //console.log(data);
            if (file_name.length <= _fileNameSize){
                _Kernel.krnTrace("Creating file " + file_name + " in TSB:" + t + ":" + s + ":" + b);
                console.log("Creating file " + file_name + " in TSB:" + t + ":" + s + ":" + b);
                
                for (var i = 0; i < file_name.length; i++){
                    charCode = file_name.charCodeAt(i);
                    data[i+2] = charCode;
                }
                console.log(data);
                sessionStorage.setItem("TSB:" + t + ":" + s + ":" + b, JSON.stringify(data));
                
                _hdd.updateHDDTable();
            } else{
                _StdOut.putText("File name to long! Max length is " + _fileNameSize + " characters.");
                return false;
            }
            
        };
        fsDD.prototype.krnfsDDDeleteFile = function (file_name) {
            // Deletes a file on disk
            console.log('Deleting file ' + file_name + ' on disk ' + _hdd.id);
        };
        
        return fsDD;
    })(TSOS.DeviceDriver);
    TSOS.fsDD = fsDD;
})(TSOS || (TSOS = {}));
