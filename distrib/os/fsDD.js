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
            _super.call(this, this.krnfsDDDriverEntry(), this.usingDisk());
        }
        fsDD.prototype.krnfsDDDriverEntry = function () {
            console.log('here');
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            console.log('Status: ' + this.status);
            console.log('What is this: ' + this);
        };
        fsDD.prototype.usingDisk = function () {
            console.log('Disk being used.');
        };
        fsDD.prototype.mount = function () {
            // Creates a new disk -- for simulating mounting a 
            // new secondary storage device.
            _currHDD += 1;
            console.log('Mounted Disk: ' + _currHDD);
            
            _availableHDD.enqueue(_currHDD);
            console.log('Available Disks: ' + _availableHDD.toString());
            
            this.format();
            
            _hdd.createTable();
            
        };
        fsDD.prototype.format = function () {
            // Sets disk to 0's 
            console.log('Disk ' + _hdd.id + ' formatted.');
        };
        fsDD.prototype.createFile = function (file_name) {
            // Creates a file on disk
            console.log('Creating file ' + file_name + ' on disk ' + _hdd.id);
        };
        fsDD.prototype.readFile = function (file_name) {
            // Reads a file on disk
            console.log('Reading file ' + file_name + ' on disk ' + _hdd.id);
        };
        fsDD.prototype.deleteFile = function (file_name) {
            // Deletes a file on disk
            console.log('Deleting file ' + file_name + ' on disk ' + _hdd.id);
        };
        fsDD.prototype.editFile = function ( file_name, data) {
            // Edits a file on disk
            console.log('Editing file ' + file_name + ' on disk ' + _hdd.id);
        };
        return fsDD;
    })(TSOS.DeviceDriver);
    TSOS.fsDD = fsDD;
})(TSOS || (TSOS = {}));
