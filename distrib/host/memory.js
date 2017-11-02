///<reference path="../globals.js" />
/* ------------
     memory.js

     Requires global.js.

     Routines for the host MEMORY simulation, NOT for the OS itself.

------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(bytes = Array(_DefaultMemorySize)) {
            this.bytes = bytes;
            this.clearMem();
            this.createTable();
        }
        
        //TODO: Proj 3 - Add base and limit to clear a segment of memory
        // Set all bytes to 00 by default
        Memory.prototype.clearMem = function (){
            var i = _DefaultMemorySize - 1;
            while(i >= 0){
                this.bytes[i] = "00";
                i--;
            }
        }
        
        // Creates HTML table dynamically
        // Credit to: 
        // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
        // for teaching me how to do this - originally copy and pasted
        // but edited for my needs
        Memory.prototype.createTable = function(){
            var loc = 0;
            var rowIndex = 0;
            
            var body = document.getElementById("divMemoryOutput");
 
            // creates a <table> element and a <tbody> element
            var tbl = document.createElement("table");
            
            //var tblHead = document.createElement("thead");
            //var thRow = document.createAttribute("tr");
            //var th = document.createAttribute("th");
            //var header = document.createTextNode("Memory");
            
            //th.appendChild(header);
            //thRow.appendChild(th);
            //tblHead.appendChild(thRow);
            
            var tblBody = document.createElement("tbody");
            
            var tblHead = document.createElement("thead");
            var headRow = document.createElement("tr");
            var head = document.createElement("th");
            var headText = document.createTextNode("Memory");
            
            head.setAttribute("colspan","9");
            head.setAttribute("style", "text-align:center;");
            
            head.appendChild(headText);
            headRow.appendChild(head);
            tblHead.appendChild(headRow);
            tbl.appendChild(tblHead);
            
            // creating all cells
            for (var i = 0; i < 32; i++) {
            // creates a table row
                var row = document.createElement("tr");
                var locCell = document.createElement("td");
                if (rowIndex < 16){
                    var locText = document.createTextNode("0x00" + rowIndex.toString(16).toUpperCase());
                }
                else if (rowIndex >= 256){
                    var locText = document.createTextNode("0x" + rowIndex.toString(16).toUpperCase());
                }
                else{
                    var locText = document.createTextNode("0x0" + rowIndex.toString(16).toUpperCase());
                }
                
                
                locCell.appendChild(locText);
                row.appendChild(locCell);
                rowIndex += 8;
                for (var j = 0; j < 8; j++) {
                    // Create a <td> element and a text node, make the text
                    // node the contents of the <td>, and put the <td> at
                    // the end of the table row
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(this.bytes[loc]);
                    cell.setAttribute("id", "mem" + loc)
                    loc++;
                    
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
 
                // add the row to the end of the table body
                tblBody.appendChild(row);
            }
 
            //put the <thead> in the <table>
            //tbl.appendChild(tblHead);
            // put the <tbody> in the <table>
            tbl.appendChild(tblBody);
            // appends <table> into <body>
            body.appendChild(tbl);
            // sets the class to bootstrap settings
            tbl.setAttribute("class", "table table-bordered table-responsive");
        }
        
        //TODO: Edit a single byte in a location
        Memory.prototype.edit = function (){
            
        }
        
        //TODO: View a byte in a specific location
        Memory.prototype.viewByte = function (){
            
        }
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));