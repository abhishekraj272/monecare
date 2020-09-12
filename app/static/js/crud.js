/**
 * Adds event listeners for all <tr> in the data table: mouseenter, mouse leave
 * Also adds evnet listeners for icons in the 3rd column: click
 */
export function assignEventHandlers(){
    let target_rows = $('.datarow');
    target_rows.each(function(){
        $(this).mouseenter(handleMouseEnter);
        $(this).mouseleave(handleMouseLeave);
        $(this).children(".column3").children("#editRow").click(editRow);
        $(this).children(".column3").children("#deleteRow").click(deleteRow);
    });
}

/**
 * Make icons visible when user mouse enters a row in the table
 */
function handleMouseEnter(){
    //We want to target the i elements in column 3 and make them visible
    let my_grandchildren = $(this).children('.column3').children('i');
    my_grandchildren.removeClass('invisible');
    my_grandchildren.addClass('visible');
}

/**
 * Make icons invisible when user mouse leaves a row in the table
 */
function handleMouseLeave(){
    //We want to target the i elements in column 3 and make them invisible
    let my_grandchildren = $(this).children('.column3').children('i');
    my_grandchildren.removeClass('visible');
    my_grandchildren.addClass('invisible');
}
/**
 * Edit the data for the selected row. 
 * Row selected via click event 
 */
function editRow(){
    let row_id = $(this).parent().parent().attr("id");
    createInlineForm(row_id, "edit_form");
}

/**
 * Delete the selected row
 * Row selected via click event
 */
function deleteRow(){
}

/**
 * Creates an inline form when the user decides to edit a row
 * @param {String} row_id ID of the row to create an inline form for 
 * @param {String} form Which form the generated elements belong to 
 */
function createInlineForm(row_id,form){
    let row = $('#'+row_id);
    let row_data = get_row_data(row_id);
    if ( ! $.isEmptyObject(row_data) ){

        let new_row = `
                        <tr class="cell100 body datarow" id="edit_${row_id}">
                            <td class="cell100 column1">
                                <input type="text" value="${row_data.date}" name="date" form="${form}"/>
                            </td>
                            <td class="cell100 column2">
                                <input type="text" value="${row_data.rate}" name="date" form="${form}"/>
                            </td>
                            <td class="cell100 column3">
                                <button id="inlineSubmit" type="submit" class="btn btn-outline-success p-1 rounded" form="${form}">
                                    <i class="fas fa-check"></i>
                                </button>

                                <button id="inlineCancel" type="button" class="btn btn-outline-danger p-1 rounded" form="${form}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>
                      `
        row.before(new_row);
        row.toggle();

        $('#inlineCancel').click(function(){
            $('#edit_'+row_id).remove();
            row.toggle();
        });
    }else{
        console.log("Cannot read row data for " + row);
    }
}


function inlineCancelClick(row, date, rate, actions){
    let date_element = row.children('.column1');
    let rate_element = row.children('.column2');
    let actions_element = row.children('.column3');

    date_element.html(date);
    rate_element.html(rate);
    actions_element.html(actions);
}
/**
 * Returns object containing data for selected row
 * @param {String} row_id The ID of the row to read data from
 * @return {object} Empty on failure to read row
 */
function get_row_data(row_id){
    let obj = {};
    let row = $('#'+row_id);
    let update_date = row.children('.column1').text();
    let repo_rate = row.children('.column2').text();
    if(update_date && repo_rate){
        obj.date = update_date;
        obj.rate = repo_rate;
    }
    return obj; 
}

