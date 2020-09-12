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
    let row_data = get_row_data($(this));
}

/**
 * Delete the selected row
 * Row selected via click event
 */
function deleteRow(){
    let row_data = get_row_data($(this));
}

/**
 * Returns object containing data for selected row
 * @param {JQuery Object} The icon clicked to fire the click event.
 *                        used to traverse the dom.
 * @return {object} Empty on failure to read row
 */
function get_row_data(icon){
    let obj = {};

    const row = icon.parent().parent();
    let update_date = row.children('.column1').text();
    let repo_rate = row.children('.column2').text();

    if(update_date && repo_rate){
        obj.date = update_date;
        obj.rate = repo_rate;
    }
    return obj; 
}

