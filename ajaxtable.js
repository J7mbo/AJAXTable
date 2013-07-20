/** Namespaces **/
var AJAXTable = {};

(function() {
  
    "use strict";
    
    var Table = AJAXTable.Table,
        Row = AJAXTable.Row,
        Cell = AJAXTable.Cell,
        NullTableException = AJAXTable.NullTableException,
        NullBodyException = AJAXTable.NullBodyException,
        NullRowException = AJAXTable.NullRowException,
        NullCellException = AJAXTable.NullCellException;
    
    /** Table Constructor **/
    AJAXTable.Table = function(id)
    {
        var $table = $('table#' + id),
            $body = $table.children("tbody:first"),
            rows = [];
        
        this.table = $table;
        this.id = id;
        this.rows = [];
      
        if ($table.length === 0 || $body.length === 0)
        {
            throw new AJAXTable["Null" + (($table === null) ? 'Table' : 'Body') + "Exception"](id);
        }
      
        $.each($body.children("tr"), function(k, v) 
        {
            var row = new AJAXTable.Row(v.id);
          
            $.each($(this).children("td"), function(key, value) 
            {
                row.addCell(new AJAXTable.Cell(value.innerHTML));
            });
          
            rows.push(row);
        });
      
       this.rows = rows;
    };
  
    /** Row Constructor **/
    AJAXTable.Row = function(id)
    {
        this.id = String(id);
        this.content = document.createElement('tr');
        this.cells = [];
    };
    
    /** Cell Constructor **/
    AJAXTable.Cell = function(content)
    {
        var td = document.createElement("td");
        var div = document.createElement("div");
        
        div.innerHTML = content;
        div.className = "div-slide";
        div.style.display = "none";
      
        td.appendChild(div);
        
        this.content = td;
    };
  
    /** Row Prototypes **/
    AJAXTable.Row.prototype.addCell = function(cell)
    {
        if (!(cell instanceof AJAXTable.Cell))
        {
            throw new NullCellException("addCell() requires instance of AJAXTable.Cell");
        }

        this.content.setAttribute("id", this.id);
        this.content.appendChild(cell.content);
        this.cells.push(cell);
        
        return this;
    };
  
    /** Table Prototypes **/
    AJAXTable.Table.prototype.addRow = function(row)
    {
        var ids = [];
        
        if (!(row instanceof AJAXTable.Row))
        {
            throw new NullRowException("addRow() requires instance of AJAXTable.Row");
        }
      
        var currentcellcount = this.rows[0].cells.length;
        var newcellcount = row.cells.length;
        var cellcount = $(row.content).children("td").length;

        for (var i = currentcellcount; i < newcellcount; i++)
        {
            row.cells.pop();
            $(row.content).children("td:last-child").remove();
        }
      
        $.each(this.rows, function(k, v)
        {
            var id = v.id;
            ids.push(String(id));
        });
        
        if (ids.indexOf(row.id) >= 0 || ids.indexOf(parseInt(row.id, 10)) >= 0)
        {
            var $oldrow = $.grep(this.rows, function(e) { return e.id == row.id; })[0];

            for (i = 0; i < $oldrow.cells.length; i++)
            {
                $oldrow.cells[i].content.innerHTML = row.cells[i].content.innerHTML; 
            }
        }
        else
        {
            this.rows.push(row);
        }
    };
  
    AJAXTable.Table.prototype.render = function()
    {
        var $table = $('table#' + this.id),
            $body = $($table.children("tbody")[0]),
            rows = $body.children("tr"),
            currentids = [];
      
        $.each(rows, function(k, v) { currentids.push(v.id); });

        $.each(this.rows, function(key, row)
        {
            var rowid = row.id;

            $.each(row.cells, function(k, cell)
            {
                var internalcellcontents = cell.content.innerText;
                var replacementcontents = null;

                $.each(rows, function(kk, currentrow)
                {
                    if (currentrow.id === rowid)
                    {
                        $.each($(currentrow), function(kkk, currentcell)
                        {
                            replacementcontents = $(currentcell).find("div.div-slide").html();
                          
                            if (replacementcontents != internalcellcontents)
                            {
                               $(currentcell).find("div.div-slide").html(internalcellcontents);
                            }
                        });
                      
                        return;
                    }
                });
            });
        });
     
        $.each(this.rows, function(key, row)
        {
            if (currentids.indexOf(row.id) === -1)
            {
                var $row = $(row.content);
                $table.prepend($row);

                $row.find('.div-slide').slideDown();
              
                var rules = "<style type='text/css'> tr:not(.animating) { transition: background-color 1s; " +
                    "-webkit-transition: background-color 1s; -moz-transition: background-color 1s; } " +
                    "tr.animating { background-color: orange; transition: background-color 0.5s; " +
                    "-webkit-transition: background-color 0.5s; -moz-transition: background-color 0.5s; } " +
                    " table { border-collapse: collapse; border-spacing: 0px; } </style>";
   
                $(rules).appendTo("head");

                $row.addClass('animating');
              
                setTimeout(function() {
                    $row.removeClass('animating');
                }, 1000);     
            }
        });
    };
    
    /** Custom Exceptions **/
    AJAXTable.NullTableException = function(id)
    {
        this.message = "Table with id: '" + id + "' cannot be found";
        console.log(this.message);
    };
    
    AJAXTable.NullBodyException = function(id)
    {
        this.message = "Table with id: '" + id + "' has no <tbody>";
        console.log(this.message);
    };
    
    AJAXTable.NullRowException = function(message)
    {
        this.message = message;
        console.log(this.message);
    };
    
    AJAXTable.NullCellException = function(message)
    {
        this.message = message;
        console.log(this.message);
    };
    
    /** Stack Trace Enablers **/
    AJAXTable.NullTableException.prototype = new Error();
    AJAXTable.NullTableException.prototype = new Error();
    AJAXTable.NullRowException.prototype = new Error();
    AJAXTable.NullCellException.prototype = new Error();
}());
