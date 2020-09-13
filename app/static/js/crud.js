/*
 * Adds event listeners for all <tr> in the data table: mouseenter, mouse leave
 * Also adds event listeners for icons in the 3rd column: click
 */
export function initCRUD() {
  $(".container").append(`<span class="d-none" id="editCount">0</span>`);
  let target_rows = $(".datarow");
  target_rows.each(function () {
    initRow($(this));
  });
}

function initRow(row) {
  row.mouseenter(handleMouseEnter);
  row.mouseleave(handleMouseLeave);
  row.children(".column3").children("#editRow").click(editRow);
  row.children(".column3").children("#deleteRow").click(deleteRow);
}

/**
 * Make icons visible when user mouse enters a row in the table
 */
function handleMouseEnter() {
  //We want to target the i elements in column 3 and make them visible
  let my_grandchildren = $(this).children(".column3").children("i");
  my_grandchildren.removeClass("invisible");
  my_grandchildren.addClass("visible");
}

/**
 * Make icons invisible when user mouse leaves a row in the table
 */
function handleMouseLeave() {
  //We want to target the i elements in column 3 and make them invisible
  let my_grandchildren = $(this).children(".column3").children("i");
  my_grandchildren.removeClass("visible");
  my_grandchildren.addClass("invisible");
}
/**
 * Edit the data for the selected row.
 * Row selected via click event
 */
function editRow() {
  let row_id = $(this).parent().parent().attr("id");
  createInlineForm(row_id, "edit_form");
}

/**
 * Delete the selected row
 * Row selected via click event
 */
function deleteRow() {}

/**
 * Creates an inline form when the user decides to edit a row
 * @param {String} row_id ID of the row to create an inline form for
 * @param {String} form Which form the generated elements belong to
 */
function createInlineForm(row_id, form) {
  if (inline_counter() === 0) {
    inline_counter("inc");
    let row = $("#" + row_id);
    let row_data = get_row_data(row_id);
    if (!$.isEmptyObject(row_data)) {
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
                      `;
      row.before(new_row);
      row.toggle();

      $("#inlineCancel").click(function () {
        $("#edit_" + row_id).remove();
        row.toggle();
        inline_counter("dec");
      });
    } else {
      //if (!$.isEmptyObject(row_data)) {
      console.log("Cannot read row data for " + row);
    }
  }
  // Alert use they have an inline form already
}

/**
 * Used to keep track of how many inline forms have been created
 * Stores value in a hidden span with the id if "editCount".
 *
 * @param {String} cmd  None - return count
 *                     "inc" - Increment the count by one
 *                     "dec" - Decrement the count by one
 * @return {Integer} Number of open inline forms
 */
function inline_counter(cmd) {
  let element = $("#editCount");
  let value = parseInt(element.text());

  switch (cmd) {
    case "inc":
      ++value;
      element.text(value);
      return value;
    case "dec":
      --value;
      element.text(value);
      return value;
    default:
      return value;
  }
}
/**
 * Returns object containing data for selected row
 * @param {String} row_id The ID of the row to read data from
 * @return {object} Empty on failure to read row
 */
function get_row_data(row_id) {
  let obj = {};
  let row = $("#" + row_id);
  let update_date = row.children(".column1").text();
  let repo_rate = row.children(".column2").text();
  if (update_date && repo_rate) {
    obj.date = update_date;
    obj.rate = repo_rate;
  }
  return obj;
}
