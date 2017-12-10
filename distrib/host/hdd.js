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
                        cell.setAttribute("id", + i + ":" + j + ":" + k);
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