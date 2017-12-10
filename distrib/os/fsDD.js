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
        fsDD.prototype.krnfsDDUsingDisk = function () {
            console.log('Disk being used.');
        };
        fsDD.prototype.krnfsDDGetAvailableDirSpace = function (){
            // returns next free directory space
            /*
                * DIR:  0 0 1 to
                * DIR:  0 7 7
            */
                
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
                        data = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
                        console.log("TSB:" + t + ":" + s + ":" + b + ": " + data[0]);
                        if (data[0] == 0){
                            console.log("found " + [t, s, b]);
                            return [t, s, b];
                        }
                    }
                }
            }
            
            return false;
        };
        
        fsDD.prototype.krnfsDDFormat = function () {
            // Sets disk to 0's 
            _Kernel.krnTrace('Formatting hard drive.');
            var emptyBlock = [];
            for (var l = 0; l < _blockSize; l++){
                emptyBlock.push('00');
            }
            for (var t = 0; t < _hdd.tracks; t++){
                for (var s = 0; s < _hdd.sectors; s++){
                    for (var b = 0; b < _hdd.blocks; b++){
                        this.krnfsDDWriteFile(t, s, b, emptyBlock);
                    }
                }
            }
            console.log('Disk ' + _hdd.id + ' formatted: ' + _hdd.formatted);
            _hdd.formatted = true;
            _Kernel.krnTrace('Hard drive formatted');
        };
        fsDD.prototype.krnfsDDCreateFile = function (file_name) {
            // Creates a file on disk
            var tsb = this.krnfsDDGetAvailableFileSpace();
            if (tsb != false){
                var t = tsb[0];
                var s = tsb[1];
                var b = tsb[2];
            } else{
                _StdOut.putText("Your cube is full.");
                return false;
            }
            
            
            data = sessionStorage.getItem('TSB:' + t + ":" + s + ":" + b);
            console.log(data);
            if (file_name.length < _blockSize-2){
                _Kernel.krnTrace("Creating file " + file_name + " in TSB:" + t + ":" + s + ":" + b);
                console.log("Creating file " + file_name + " in TSB:" + t + ":" + s + ":" + b);
                data[0] = "01";
                console.log(data[0]);
                for (var i = 0; i < file_name.length; i++){
                    charCode = file_name.charCodeAt(i);
                    data[i+1] = charCode;
                }
                
                document.getElementById(t + ":" + s + ":" + b).innerHTML = data;
            } else{
                _StdOut.putText("File name to long! Max length is 62 characters.");
                return false;
            }
            
        };
        fsDD.prototype.krnfsDDReadFile = function (file_name) {
            // Reads a file on disk
            console.log('Reading file ' + file_name + ' on disk ' + _hdd.id);
        };
        fsDD.prototype.krnfsDDDeleteFile = function (file_name) {
            // Deletes a file on disk
            console.log('Deleting file ' + file_name + ' on disk ' + _hdd.id);
        };
        fsDD.prototype.krnfsDDWriteFile = function (t, s, b, data) {
            // Edits a file on disk
            //console.log('Writing ' + data + ' to tsb ' + t + ':' + s + ':' + b);
            if (t < _hdd.tracks && s < _hdd.sectors && b < _hdd.blocks){
                sessionStorage.setItem("TSB:" + t + ":" + s + ":" + b, data);
            } else{
                console.log("Stay in your cube! " + t + ":" + s + ":" + b + " is not in your cube!");
            }
        };
        return fsDD;
    })(TSOS.DeviceDriver);
    TSOS.fsDD = fsDD;
})(TSOS || (TSOS = {}));
