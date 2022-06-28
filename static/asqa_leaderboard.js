(function() {
  let ourPaperURL = "https://arxiv.org/abs/2204.06092";
  let ourModelName1 = "T5-O-5";
  let ourModelName2 = "T5-C";
  let github = "https://github.com/google-research/language/tree/master/language/asqa";

  var data = [
    {
      "rank": "0",
      "date": "Apr 12, 2022",
      "model": "HUMAN W CONTEXT",
      "institution": "Google",
      "paper": "Stelmakh et al.",
      "paper-url": ourPaperURL,
	"result": ["49.4", "77.4", "61.8", "-"]
    },
    {
      "rank": "0",
      "date": "Apr 12, 2022",
      "model": "HUMAN W/O CONTEXT",
      "institution": "Google",
      "paper": "Stelmakh et al.",
      "paper-url": ourPaperURL,
	"result": ["42.2", "39.0", "40.6", "-"]
    },
    {
      "rank": "1",
      "date": "Apr 12, 2022",
      "model": ourModelName1,
      "institution": "Google",
      "paper": "Stelmakh et al.",
      "paper-url": ourPaperURL,
	"result": ["39.2", "26.4", "32.1", "29.7"]
    },
    {
      "rank": "2",
      "date": "Apr 12, 2022",
      "model": ourModelName2,
      "institution": "Google",
      "paper": "Stelmakh et al.",
      "paper-url": ourPaperURL,
	"result": ["31.0", "7.4", "15.1", "-"]
    },
  ];

  $( window ).init(function(){
    $( window ).init(function(){

      $(".navbar-toggle").click(function(){
        if ($(".navbar-collapse").hasClass("collapse")) {
          $(".navbar-collapse").removeClass("collapse");
        } else {
          $(".navbar-collapse").addClass("collapse");
        }
      })
      $("#container").css("max-width", "2400px");
      $('.row').width($('#container').width());
      let offset = 65;
      $('.row').css('margin-top', offset + 10);
      $('.col').css('height', $( window ).height() - offset - 10);
      $('#content').append(`
        <div style="text-align: center;"><h3>ASQA leaderboard</h3></div>
        <table id="leaderboard-table" class="table"></table>
      `);
      loadTable();
      $('#sidebar').css('padding', '20px');
      $('#sidebar').css('padding-top', '30px');
      $("#sidebar").append(`
           <h3>Evaluation</h3>                                                                                                        
            <em>DR (test)</em> is the final metric for leaderboard ranking.                        
        <hr />
     <h3>Leaderboard Submission</h3>
            To submit your model, please see
            <a href="` + github + `/#leaderboard-submission-guide" target="_blank">submission guide</a>.
        `)
    })
  });

  function loadTable(){
    $('#leaderboard-table').append(`
      <thead>
        <tr>
          <th width="5%">Rank</th>
          <th width="55%">Model</th>
          <th width="10%">ROUGE-L (test)</th>
          <th width="10%">Disambig-F1 (test)</th>
          <th width="10%">DR (dev)</th>
          <th width="10%">DR (test)</th>
        </tr>
      <thead>
    `);
    var tbody = ""
    for (var i=0; i<data.length; i++) {
      tbody += loadRow(i, data);
    }
    $('#leaderboard-table').append("<tbody>" + tbody + "</tbody>");
  }

  function loadRow(i, data) {
    let className = (i%2===0)? "gray" : "";
    var tbody = `<tr class="` + className + `">
      <td>` + data[i]["rank"] + `<br /><span class="label lable-default date">` + data[i]["date"] + `</span></td>
      <td><span class="modelname">` + data[i]["model"] + `</span><br />
      <span class="institution">` + data[i]["institution"] + `</span><br />`;
    if (data[i]["paper"].length>0 && data[i]["paper-url"].length>0) {
      tbody += `<a class="paper" target="_blank" href="` + data[i]["paper-url"] + `">` + data[i]["paper"] + `</a>`;
    }
    tbody += "</td>";
    for (var j=0; j<data[i]["result"].length; j++) {
      tbody += `<td>` + data[i]["result"][j] + `</td>`;
    }
    tbody += "</tr>";
    return tbody;
  }

})();
