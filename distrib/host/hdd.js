///<reference path="../globals.js" />

/* ------------
     hdd.js

     Requires global.js.

     Routines for the host hdd simulation, NOT for the OS itself.

------------ */
var TSOS;
(function (TSOS) {
    var hdd = (function () {
        function hdd(tracks, sectors, blocks, id, formatted, mounted) {
            if (id === void 0) { _currHDD += 1; id = _currHDD; }
            if (formatted === void 0) { formatted = false; }
            if (mounted === void 0) { mounted = false; }
            this.id = _currHDD;
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.formatted = formatted;
            this.mounted = mounted;
        }
        hdd.prototype.mount = function () {
            // Simulates mounting a 
            // new secondary storage device.
            console.log('Mounted Disk: ' + _hdd.id);
            _krnfsDDDriver.krnfsDDFormat();
            
            // For possibly mounting multiple hdd?
            // Future use, not present
            _availableHDD.enqueue(_hdd.id);
            console.log('Available Disks: ' + _availableHDD.toString());
            
            _hdd.mounted = true;
            
            _hdd.createTable();
            console.log('table created');
            
        };
        hdd.prototype.read = function (file_name) {
            // Reads a file on disk
            //TODO: FINISH THIS
            //console.log('Reading file ' + file_name + ' on disk ' + this.id);
            
            fileFound = this.findFile(file_name);
            if (fileFound){
                console.log("File Found!");
            } else {
                console.log("File not found!");
            }
        };
        hdd.prototype.write = function (t, s, b, data) {
            // Edits a file on disk
            //console.log('Writing ' + data + ' to tsb ' + t + ':' + s + ':' + b);
            if (t < this.tracks && s < this.sectors && b < this.blocks){
                sessionStorage.setItem("TSB:" + t + ":" + s + ":" + b, JSON.stringify(data));
                //console.log("New Data: " + sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b));
            } else{
                console.log("Stay in your cube! " + t + ":" + s + ":" + b + " is not in your cube!");
            }
        };
        hdd.prototype.checkUseBit = function (t, s, b){
            // returns true if block on hdd is free
            // returns false if not free
            var uncleanData = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
            
            var data = JSON.parse(uncleanData);
            
            if (data[0] === "00"){
                return true;
            }
            
            return false;
        };
        hdd.prototype.flipUseBit = function (t, s, b){
            // Changes in-use bit to 01 if it's 00 or
            // 00 if it's 01
            var uncleanData = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
            
            var data = JSON.parse(uncleanData);
            
            if (data[0] === "00"){
                data[0] = "01";
                console.log('Bit flipped to 01 in TSB: ' + t + ":" + s + ":" + b);
            } else{
                data[0] = "00";
                console.log('Bit flipped to 00 in TSB: ' + t + ":" + s + ":" + b);
            }
            sessionStorage.setItem("TSB:" + t + ":" + s + ":" + b, JSON.stringify(data));
        };
        hdd.prototype.setChainBit = function (t, s, b){
            // Sets the chainbit to the next available free file space
            var uncleanData = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
            
            var data = JSON.parse(uncleanData);
            
            var tsb = this.getAvailableFileSpace();
            
            nextT = tsb[0];
            nextS = tsb[1];
            nextB = tsb[2];
            
            data[_blockSize-3] = "0" + nextT;
            data[_blockSize-2] = "0" + nextS;
            data[_blockSize-1] = "0" + nextB;
            
            this.write(t, s, b, data);
            
            this.flipUseBit(nextT, nextS, nextB);
        };
        hdd.prototype.getChainBit = function (t, s, b){
            // Returns next location from chain bits of a block
            var uncleanData = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
            
            var data = JSON.parse(uncleanData);
            
            data[_blockSize-3] = "0" + nextT;
            data[_blockSize-2] = "0" + nextS;
            data[_blockSize-1] = "0" + nextB;
            
            return [nextT, nextS, nextB];
        };
        hdd.prototype.zeroBlock = function (t, s, b){
            // Enables use of zfod
            _hdd.write(t, s, b, _emptyBlock);
            
        };
        hdd.prototype.updateHDDTable = function (){
            // Updates the gui for hdd
            for (var t = 0; t < _hdd.tracks; t++){
                for (var s = 0; s < _hdd.sectors; s++){
                    for (var b = 0; b < _hdd.blocks; b++){
                        document.getElementById(t + ":" + s + ":" + b).innerHTML = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
                    }
                }
            }
        };
        hdd.prototype.findFile = function (file_name){
            // Simulates heads spinning to find the tsb that contains
            // a file.
            // Returns [t, s, b]
            for (var t = 0; t < _hdd.tracks; t++){
                for (var s = 0; s < _hdd.sectors; s++){
                    for (var b = 0; b < _hdd.blocks; b++){
                        if (b !== 0 || s !== 0){
                            console.log("Checking: " + t + ":" + s + ":" + b)
                        
                            if(!this.checkUseBit(t, s, b)){
                                var uncleanData = sessionStorage.getItem("TSB:" + t + ":" + s + ":" + b);
                
                                var data = JSON.parse(uncleanData);
                                
                                var diskFN = '';
                                
                                for (var i = 0; i <= _fileNameSize; i++){
                                    if (data[i+2] != "00"){
                                        diskFN += String.fromCharCode(data[i+2]);
                                    }
                                }
                                if (file_name === diskFN){
                                    console.log('Found file: ' + diskFN);
                                    return [t, s, b];
                                }
                            }
                        }
                    }
                }
            }
            
            return false;
            
        };
        hdd.prototype.getAvailableDirSpace = function (){
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
                        if(this.checkUseBit(t, s, b)){
                            return [t, s, b];
                        }
                    }
                }
            }
            return false;
        };
        hdd.prototype.getAvailableFileSpace = function (){
            // returns [track, sector, block] for next available
            // file space.
            /*
                * FILE: 1 0 0 to
                * FILE: 3 7 7
            */
            
            for (var t = 1; t < _hdd.tracks; t++){
                for (var s = 0; s < _hdd.sectors; s++){
                    for (var b = 0; b < _hdd.blocks; b++){
                        if(this.checkUseBit(t, s, b)){
                            return [t, s, b];
                        }
                    }
                }
            }
            
            return false;
        };
        // Creates HTML HDD table dynamically
        // TODO: Edit this for creation of multiple tables
        // for multiple HDD?
        hdd.prototype.createTable = function(){
            var body = document.getElementById("divHDDOutput");
 
            // creates a <table> element and a <tbody> element
            var tbl = document.createElement("table");
            
            var tblBody = document.createElement("tbody");
            
            var tblHead = document.createElement("thead");
            var headRow = document.createElement("tr");
            var head = document.createElement("th");
            var headText = document.createTextNode("Hard Disk Drive");
            
            head.setAttribute("colspan","2");
            head.setAttribute("style", "text-align:center;");
            
            head.appendChild(headText);
            headRow.appendChild(head);
            tblHead.appendChild(headRow);
            tbl.appendChild(tblHead);
            
            // creating all cells
            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++){
                    for (var k = 0; k < this.blocks; k++){
                        // creates a table row
                        var row = document.createElement("tr");
                        var locCell = document.createElement("td");
                        var locText = document.createTextNode(i + ":" + j + ":" + k);
                        //locCell.setAttribute("style", "font-size:10pt");
                        locCell.appendChild(locText);
                        row.appendChild(locCell);
                        
                        // Create a <td> element and a text node, make the text
                        // node the contents of the <td>, and put the <td> at
                        // the end of the table row
                        var cell = document.createElement("td");
                        var cellText = document.createTextNode(sessionStorage.getItem("TSB:" + i + ":" + j + ":" + k));
                        cell.setAttribute("id", i + ":" + j + ":" + k);
                        cell.setAttribute("style", "font-size:10pt");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
         
                        // add the row to the end of the table body
                        tblBody.appendChild(row);
                    }
                }
            }
            
 
            //put the <thead> in the <table>
            //tbl.appendChild(tblHead);
            // put the <tbody> in the <table>
            tbl.appendChild(tblBody);
            // appends <table> into <body>
            body.appendChild(tbl);
            // sets the class to bootstrap settings
            tbl.setAttribute("class", "table table-bordered table-responsive");
        };
        
        return hdd;
    })();
    TSOS.hdd = hdd;
})(TSOS || (TSOS = {}));