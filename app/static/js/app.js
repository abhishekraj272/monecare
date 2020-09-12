let url = window.location.origin + "/api/v1/repo-rate";
let timeArr = [];
let rateArr = [];

$.ajax({
  type: "GET",
  headers: {
    "API-KEY": "qwerty",
  },
  contentType: "application/json",
  url: url,
  data: {},
  success: function (data) {
    data = JSON.parse(data);

    for (let i = 0; i < data.length; i++) {
      timeArr.push(data[i].date.date);
      rateArr.push(data[i].rate);
    }

    generateTable();
    generateGraph();
  },
  error: function (data) {
    console.log(data);
  },
});

function generateTable() {
  for (let i = 0; i < timeArr.length; i++) {
    $(".t-body").prepend(
      `
        <tr class="row100 body datarow">
                    <td class="cell100 column1">${timeArr[i]}</td>
                    <td class="cell100 column2">${rateArr[i]}</td>
                    <td class="cell100 column3">
                       <i id="editRow" class="fas fa-edit px-2 invisible" ></i> 
                       <i id="deleteRow" class="fas fa-trash px-1 invisible"></i>
                    </td>
        </tr>
      `
    );
  }
}

function generateGraph() {
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: timeArr,
      datasets: [
        {
          label: "Repo Rate",
          lineTension: 0,
          backgroundColor: "transparent",
          borderColor: "blue",
          data: rateArr,
          pointRadius: 5,
          pointHoverRadius: 10,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: "rectRounded",
        },
      ],
    },

    // Configuration options go here
    options: {},
  });
}

let anaytics = []
$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
  analytics = JSON.stringify(data, null, 2);
});

$(document).ready(function() {

  // process the form
  $('form').submit(function(event) {

      // get the form data
      // there are many ways to get this data using jQuery (you can use the class or id also)
      var formData = {
          'name'              : $('input[name=name]').val(),
          'email'             : $('input[name=email]').val(),
          'analytics'    : analytics
      };

      let csrf_token = $('input[name=csrf_token]').val()

      // process the form
      $.ajax({
          type        : 'PUT', 
          url         : 'api/v1/subscribe',
          data        : formData, 
          dataType    : 'json',
          headers     : {'X-CSRFToken': csrf_token}
      })
          // using the done promise callback
          .done(function(data) {

              // log data to the console so we can see
              alert("Your response has been recorded.")

              // here we will handle errors and validation messages
          });

      // stop the form from submitting the normal way and refreshing the page
      event.preventDefault();
  });

});
