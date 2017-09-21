///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted == true) {
                    
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57)) {
                if (isShifted){
                    if (keyCode === 48) {
                        chr = ')';
                    }
                    else if (keyCode === 49){
                        chr = '!';
                    }
                    else if (keyCode === 50){
                        chr = '@';
                    }
                    else if (keyCode === 51){
                        chr = '#';
                    }
                    else if (keyCode === 52){
                        chr = '$';
                    }
                    else if (keyCode === 53){
                        chr = '%';
                    }
                    else if (keyCode === 54){
                        chr = '^';
                    }
                    else if (keyCode === 55){
                        chr = '55'; // is &
                    }
                    else if (keyCode === 56){
                        chr = '*';
                    }
                    else if (keyCode === 57){
                        chr = '57' // is (
                    }
                }
                else{
                    if (keyCode === 48) {
                        chr = '0';
                    }
                    else if (keyCode === 49){
                        chr = '1';
                    }
                    else if (keyCode === 50){
                        chr = '2';
                    }
                    else if (keyCode === 51){
                        chr = '3';
                    }
                    else if (keyCode === 52){
                        chr = '4';
                    }
                    else if (keyCode === 53){
                        chr = '5';
                    }
                    else if (keyCode === 54){
                        chr = '6';
                    }
                    else if (keyCode === 55){
                        chr = '5/5'; // is 7
                    }
                    else if (keyCode === 56){
                        chr = '8';
                    }
                    else if (keyCode === 57){
                        chr = '5/7' // is 9
                    }
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) || // Space
                (keyCode == 13) ||  // Enter
                (keyCode == 8) || // Backspace
                (keyCode == 9) || // Tab
                (keyCode == 38) || // Up key
                (keyCode == 40)){ // Down key
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else {
                if (keyCode === 186){
                    chr = (isShifted) ? ":" : ";";
                }
                else if (keyCode === 187){
                    chr = (isShifted) ? "+" : "=";
                }
                else if (keyCode === 188){
                    chr = (isShifted) ? "<" : ",";
                }
                else if (keyCode === 189){
                    chr = (isShifted) ? "_" : "-";
                }
                else if (keyCode === 190){
                    chr = (isShifted) ? ">" : ".";
                }
                else if (keyCode === 191){
                    chr = (isShifted) ? "?" : "/";
                }
                else if (keyCode === 192){
                    chr = (isShifted) ? "~" : "`";
                }
                else if (keyCode === 219){
                    chr = (isShifted) ? "{" : "[";
                }
                else if (keyCode === 220){
                    chr = (isShifted) ? "|" : "\\";
                }
                else if (keyCode === 221){
                    chr = (isShifted) ? "}" : "]";
                }
                else if (keyCode === 222){
                    chr = (isShifted) ? "\"" : "'";
                }
                //console.log('CHR: ' + chr + ' ' + keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
