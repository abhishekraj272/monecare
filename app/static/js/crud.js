import { loadPage } from "./app.js";
/*
 * Responsible for initialising C.R.U.D functionality for the app.
 * It's important to call this after the data has been updated via AJAX.
 */
export function initCRUD() {
  //Acts as a static variable to keep count of how many inline forms have been created
  $(".container").append(`<span class="d-none" id="editCount">0</span>`);

  let target_rows = $(".datarow");
  target_rows.each(function () {
    initRow($(this));
  });
}

/**
 * Initialise each datarow. Currently handles mouseenter and leave
 * events to show edit / delete icon to the user.
 * It also registers the onclick handlers for the edit / delete icon
 * @param (JQuery Object) row The row to handle events for
 */
function initRow(row) {
  row.mouseenter(handle_mouse_enter);
  row.mouseleave(handle_mouse_leave);
  row.children(".column3").children("#editRow").click(edit_row);
  row.children(".column3").children("#deleteRow").click(delete_row);
}

/**
 * Make icons visible when user mouse enters a row in the table
 */
function handle_mouse_enter() {
  //We want to target the i elements in column 3 and make them visible
  let my_grandchildren = $(this).children(".column3").children("i");
  my_grandchildren.removeClass("invisible");
  my_grandchildren.addClass("visible");
}

/**
 * Make icons invisible when user mouse leaves a row in the table
 */
function handle_mouse_leave() {
  //We want to target the i elements in column 3 and make them invisible
  let my_grandchildren = $(this).children(".column3").children("i");
  my_grandchildren.removeClass("visible");
  my_grandchildren.addClass("invisible");
}
/**
 * Edit the data for the selected row.
 * Row selected via click event on the edit icon
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
  //We only want to allow the user to edit one row.
  if (inline_counter() === 0) {
    let row = $("#" + row_id);
    let row_data = get_row_data(row_id);
    //If we have successful obtained the current data for the row
    if (!$.isEmptyObject(row_data)) {
      // Flag that we have an inline form and display it.
      inline_counter("inc");
      let new_row = get_inline_edit_row(row_id, row_data, form);
      row.before(new_row);
      row.toggle();

      // What happens if the user clicks the cancel button on
      // newly inserted inline form
      $("#inlineCancel").click(function () {
        //Remove the inline form and display the old row
        cancel_inline_form(row_id);
      });

      $("#inlineSubmit").click({ selected_row: row_id }, handleFormSubmit);
    } else {
      //if (!$.isEmptyObject(row_data)) {
      console.log("Cannot read row data for " + row);
    }
  } else {
    // Alert to user they have an inline form already
    highlight_inline_form();
  }
}

/**
 * Direct form data to appropriate function based on which form the submit
 * was attached to
 *
 * @params {Event Object} e event information
 */
function handle_form_submit(e) {
  let form = e.currentTarget.form.id;
  switch (form) {
    case "edit_form":
      handle_edit_form(e.data.selected_row);
      break;
    case "delete_form":
      handle_delete_form(e.data.selected_row);
      break;
    default:
      console.log(`Can not handle submissions for form ${form}`);
  }
}

/**
 *
 */
function handle_delete_form(row_id) {
  let data = get_row_data(row_id);

  //Submit to server via ajax
  let form = $("#delete_form");
  let csrf_token = form.children("input[name=csrf_token]").val();

  $.ajax({
    type: form.attr("method"),
    url: form.attr("action"),
    headers: {
      "API-KEY": "qwerty",
      "X-CSRFToken": csrf_token,
    },
    data: data,
  })
    .done(function (data) {
      cancel_inline_form(row_id, "delete_" + row_id);
      console.log(JSON.stringify(data));
      loadPage();
    })
    .fail(function (data) {
      console.log("FAIL" + JSON.stringify(data));
      if (!$("#deleteFail").length) {
        create_alert("Database issue. Could not delete row", "deleteFail");
      }
    });
}
/**
 * Tries to verify and validate user input if the user
 * submits to edit a row. Submits the request if all is ok.
 *
 * @param {String} row_id ID of the row being edited
 */
function handle_edit_form(row_id) {
  let new_date = $("input[name=date]").val().trim();
  let new_rate = $("input[name=repo_rate]").val().trim();

  // User has entered some new data
  if (new_date || new_rate) {
    let old_data = get_row_data(row_id);

    //If the user has entered a new date and rate, or just a new date
    //and these pieces of data match the old values create an alert
    //and return focus to the date textbox
    if (
      (old_data.date === new_date && old_data.rate === new_rate) ||
      (old_data.date === new_date && !new_rate)
    ) {
      create_alert("You must enter a new value", "alert2");
      $("#alert2").on("closed.bs.alert", function () {
        $("input[name=date]").focus();
      });
      return;
    }

    //If the user has entered a new rate and no date
    //but the rate matches the old one create an alert
    //and return focus to the rate textbox
    if (old_data.rate === new_rate && !new_date) {
      create_alert("You must enter a new value", "alert3");
      $("#alert3").on("closed.bs.alert", function () {
        $("input[name=repo_rate]").focus();
      });
      return;
    }

    //If the user only wants to edit one property, supply the old value
    //for the other property they haven't changed
    if (!new_date) {
      $("input[name=date]").val(old_data.date);
    }

    if (!new_rate) {
      $("input[name=repo_rate]").val(old_data.repo_rate);
    }

    //Submit to server via ajax
    let form = $("#edit_form");
    let csrf_token = form.children("input[name=csrf_token]").val();
    let form_data = {
      date: $("input[name=date]").val(),
      repo_rate: $("input[name=repo_rate]").val(),
      old_date: old_data.date,
      old_repo_rate: old_data.repo_rate,
    };

    $.ajax({
      type: form.attr("method"),
      url: form.attr("action"),
      headers: {
        "API-KEY": "qwerty",
        "X-CSRFToken": csrf_token,
      },
      data: form_data,
    })
      .done(function (data) {
        cancel_inline_form(row_id, "edit_" + row_id);
        loadPage();
      })
      .fail(function (data) {
        console.log("FAIL" + JSON.stringify(data));
        if (!$("#dbEditRow").length) {
          create_alert("Database issue: Couldn't edit row", "dbEditRow");
        }
      });
    //User has not entered any data
    //Create an alert and return focus to date input
  } else {
    if (!$("#noEditValues").length) {
      create_alert(
        "You must enter some values before submitting",
        "noEditValues"
      );
    }
    $("#noEditValues").on("closed.bs.alert", function () {
      $("input[name=date]").focus();
    });
  }
}

/**
 * Removes the inline form and displays the row it was inserted into
 * @param (String) row_id The id of the row to display and remove form from
 */
function cancel_inline_form(row_id, inline_form_id) {
  $("#" + inline_form_id).remove();
  $("#" + row_id).toggle();
  inline_counter("dec");
}
/**
 * Plays css animation to draw users attention to the open inline form
 */
function highlight_inline_form() {
  //Have this value be the same or greater than the animation-duration in crud.css
  let animation_length = 1000;

  let row = $(".inlineForm");
  if (row) {
    row.css("animation-play-state", "running");
    setTimeout(function () {
      row.css("animation-play-state", "paused");
    }, animation_length);
  }
}

/**
 * Generate HTML string to insert inline form to edit a row
 *
 * @param {String} row_id The ID of the row we are going to insert the form into
 * @param {Object} row_data The old text values of each <TD> in this row
 * @param {String} form The ID of the form that the form elements belong to
 * @return {String} HTML String for the new row content
 */
function get_inline_edit_row(row_id, row_data, form) {
  let row = `
                        <tr class="cell100 body datarow inlineForm" id="edit_${row_id}">
                            <td class="cell100 column1">
                                <input type="text" class="form-control" placeholder="${row_data.date}" name="date" form="${form}" required>
                            </td>
                            <td class="cell100 column2">
                                <input type="text" class="form-control" placeholder="${row_data.repo_rate}" name="repo_rate" form="${form}" required>
                            </td>
                            <td class="cell100 column3">
                                <button id="inlineSubmit" type="button" class="btn btn-outline-success p-1 rounded" form="${form}">
                                    <i class="fas fa-check"></i>
                                </button>

                                <button id="inlineCancel" type="button" class="btn btn-outline-danger p-1 rounded" form="${form}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>
                      `;
  return row;
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
 *                  With 'date' and 'rate' on success
 */
function get_row_data(row_id) {
  let obj = {};
  let row = $("#" + row_id);
  let update_date = row.children(".column1").text();
  let repo_rate = row.children(".column2").text();
  if (update_date && repo_rate) {
    obj.date = update_date;
    obj.repo_rate = repo_rate;
  }
  return obj;
}
/**
 * Creates a bootstrap alert
 * @param {String} msg Message to display in alert
 * @param {id} id Unique ID to give to alert element
 */
function create_alert(msg, id) {
  let alert_html = `
                    <div id="${id}"class="alert alert-warning fade show" role="alert">
                        ${msg}
                        <button type="button" class="close" data-dismiss="alert" aria-label="close">
                            <span aria-hidde="true">&times;</span>
                        </button>
                    </div>
    `;
  $(".container").prepend(alert_html);
}
