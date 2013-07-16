AJAXTable
=========

OOP JavaScript / jQuery class for handling dynamic data via ajax within tables.

AJAXTable makes it easy to update a table's rows with elements retrieved via AJAX, updating those rows that already exist with new data, and prepending new rows to the table with smooth jQuery animations.

You can view the current example working [here](http://jsbin.com/obixoj/1).

Examples
========

**HTML**

    <table id="js-table">
        <thead>
            <tr>
              <td><div class="div-slide"><strong>id</strong></div></td>
              <td><div class="div-slide">value</strong></div></td>
            </tr>
        </thead>
        <tbody>
            <tr id="one">
              <td><div class="div-slide">old id</div></td>
              <td><div class="div-slide">old value</div></td>
            </tr>
        </tbody>
    </table>

**JavaScript**

    <script type="text/javascript">

        $(document).ready(function() 
        {
            // Point to a table you have in the DOM
            var table = new AJAXTable.Table('js-table');
            
            // Update the row with the id "one"
            var row = new AJAXTable.Row('one');
            row.addCell(new AJAXTable.Cell('new id'));
            row.addCell(new AJAXTable.Cell('new value'));
            row.addCell(new AJAXTable.Cell('ignored cell'));
            table.addRow(row);
            
            // Add a new row with the id "two"
            var row2 = new AJAXTable.Row('two');
            row2.addCell(new AJAXTable.Cell('brand'));
            row2.addCell(new AJAXTable.Cell('new cell'));
            row2.addCell(new AJAXTable.Cell('ignored cell'));
            table.addRow(row2);
            
            // Render the table changes
            table.render();
        });
      
    </script>
