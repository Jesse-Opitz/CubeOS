///<reference path="../globals.js" />
/* ------------
     hdd.js

     Requires global.js.

     Routines for the host hdd simulation, NOT for the OS itself.

------------ */
var TSOS;
(function (TSOS) {
    var hdd = (function () {
        function hdd(track, sector, block, formatted) {
            if (formatted === void 0) { formatted = false; }
            this.id = _currHDD;
            this.tracks = track;
            this.sectors = sector;
            this.blocks = block;
            this.formatted = formatted;
        }
        
        // Creates HTML table dynamically
        // Credit to: 
        // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
        // for teaching me how to do this - originally copy and pasted
        // but edited for my needs
        hdd.prototype.createTable = function(){
            
            var body = document.getElementById("divhddOutput");
 
            // creates a <table> element and a <tbody> element
            var tbl = document.createElement("table");
            
            //var tblHead = document.createElement("thead");
            //var thRow = document.createAttribute("tr");
            //var th = document.createAttribute("th");
            //var header = document.createTextNode("hdd");
            
            //th.appendChild(header);
            //thRow.appendChild(th);
            //tblHead.appendChild(thRow);
            
            var tblBody = document.createElement("tbody");
            
            var tblHead = document.createElement("thead");
            var headRow = document.createElement("tr");
            var head = document.createElement("th");
            var headText = document.createTextNode("hdd");
            
            head.setAttribute("colspan","9");
            head.setAttribute("style", "text-align:center;");
            
            head.appendChild(headText);
            headRow.appendChild(head);
            tblHead.appendChild(headRow);
            tbl.appendChild(tblHead);
            
            // sets the class to bootstrap settings
            tbl.setAttribute("class", "table table-bordered table-responsive");
        };
        
        return hdd;
    })();
    TSOS.hdd = hdd;
})(TSOS || (TSOS = {}));