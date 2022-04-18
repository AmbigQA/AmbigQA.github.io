(function() {

  let ENCODETITLE = [" ", "%", "!", "#", "$", "&", "'", "(", ")", "*", "+", ",", "/", ":", ";", "=",
    "?", "@", "[", "]"];
  let ENCODEURL = ["_", "%25", "%21", "%23", "%24", "%26", "%27", "%28", "%29",
    "%2A"< "%2B", "%2C", "%2F", "%3A", "%3B", "%3D", "%3F", "%40", "%5B", "%5D"];

  $( window ).init(function(){
    $(".navbar-toggle").click(function(){
      if ($(".navbar-collapse").hasClass("collapse")) {
        $(".navbar-collapse").removeClass("collapse");
      } else {
        $(".navbar-collapse").addClass("collapse");
      }
    })
    /*function setTitle() {
      if ($(window).width() > 950) {
        $('#ambigqa-title').html("AmbigQA: Answering Ambiguous Open-domain Questions");
      } else {
        $('#ambigqa-title').html("AmbigQA");
      }
    }
    setTitle();
    $(window).resize(function(){
      setTitle();
    })*/


    $("body").css("overflow", "hidden");
    $("#container").css("max-width", "2400px");
    $('.row').width($('#container').width());
    let offset = 78 + $('#second-navbar').height();
    $('.row').css('margin-top', offset + 10);
    $('.col').css('height', $( window ).height() - offset - 10);
    $('#content').html("Loading data...");
    loadData();
  });

  function loadData() {
    $('.textbox').width($('#sidebar').width());
    $('#sidebar').html('');
    $('#content').html('');
    for (var i=0; i<allData.length; i++) {
      let htmlText = `
      <div id="textbox-` + i + `" class="textbox ` + getClassName(allData[i]) + `">
      ` + allData[i]['question'] +
      `</div>
      `;
      $('#sidebar').append(htmlText);
    }
    $('.textbox').click(function () {
      $('.textbox-clicked').removeClass('textbox-clicked');
      $('#'+this.id).addClass('textbox-clicked');
      load(parseInt(this.id.substring(8, this.id.length)));
    })
    $('.mode').click(controlDisplay);
    controlDisplay();
  }

  function controlDisplay() {
    let mode = parseInt($('.mode:checked').val());
    ('.textbox-clicked');
    if (mode===0) {
      $('.multiple-dp').show();
      $('.single-dp').hide();
      if (getCurrentClassName()==="single-dp") {
        $('.textbox-clicked').removeClass('textbox-clicked');
        $('#content').html('');
      }
    } else if (mode===1) {
      $('.multiple-dp').hide();
      $('.single-dp').show();
      if (getCurrentClassName()==="multiple-dp") {
        $('.textbox-clicked').removeClass('textbox-clicked');
        $('#content').html('');
      }
    } else {
      $('.multiple-dp').show();
      $('.single-dp').show();
    }
   }

  function getClassName(data) {
    //FIXME later
    if (data['annotations'].map(ann => ann['type']==='singleAnswer').every(x => x)) {
      return "single-dp"
    } else if (data['annotations'].map(ann => ann['type']==='multipleQAs').every(x => x)) {
      return "multiple-dp"
    }
  }

  function getCurrentClassName() {
    let current = $('.textbox-clicked');
    console.assert(current.length<=1);
    if (current.length===1) {
      let currentId = current[0].id;
      return getClassName(allData[parseInt(currentId.substring(8, currentId.length))]);
    }
    return "";
  }

  function load(currentId) {
    $('#content').html("");
    let data = allData[currentId];
    /* Load the question */
    $('#content').append(getPanel("Prompt Question", data["question"]));

    /* Load AmbigQA annotations */
    /* Note: now, len(annotations) is always 1 */
    var annotations = data['annotations'];
    for (var i=0; i<annotations.length; i++) {
      var htmlText = "";
      if (annotations[i]['type']==='multipleQAs') {
        var qaPairs = annotations[i]['qaPairs'];
        for (var j=0; j<qaPairs.length; j++) {
          let pair = qaPairs[j];
          htmlText += `
              <p><span class="label label-primary">Q</span> ` + pair['question'] + `</p>
              <p><span class="label label-info">A</span> ` + pair['answer'].join(" | ") + `</p>
          `;
        }
      } else if (annotations[i]['type']==='singleAnswer') {
          htmlText = `
              <p><span class="label label-info">A</span> ` + annotations[i]['answer'].join(" | ") + `</p>
          `;
      } else {
        htmlText = `<em>Answer not found</em>`;
      }
      $('#content').append(getPanel("AmbigQA Output", htmlText));
    }

    var knowledge_list = [];
    
    /* Load ASQA annotations */
    if ("ASQA" in data) {
      var asqa_annotations = data["ASQA"];
      for (var i=0; i<asqa_annotations.length; i++) {
        $('#content').append(getPanel("ASQA Output #" + (i+1).toString(), asqa_annotations[i]["long_answer"]));
        for (var j=0; j<asqa_annotations[i]["knowledge"].length; j++) {
          let knowledge = asqa_annotations[i]["knowledge"][j];
          knowledge_list.push(knowledge)
        }
      }
    }

    /* Load Wikipedia information */
    var titleText = "";
    if (knowledge_list.length === 0) {
      for (var i=0; i<data['viewed_doc_titles'].length; i++) {
        let title = data['viewed_doc_titles'][i];
        titleText += `
          <span class='label label-simple'>
            <a href='` + getWikiURL(title) + `' target='_blank'>` + title + `</a>
          </span>`;
      }
      $('#content').append(getPanel("Wikipedia pages <span style='font-size: 90%'>(from AmbigQA)</span>", titleText));
    } else {
      for (var i=0; i<knowledge_list.length; i++) {
        let title = knowledge_list[i]["wikipage"];
        let content = knowledge_list[i]["content"]
        titleText += `
          <p style="font-size: 11.5pt; line-height: 14pt">
            <span class='label label-simple'>
              <a href='` + getWikiURL(title) + `' target='_blank'><strong>` + title + `</strong></a>
            </span>` + content + `
          </p>`;
      }
      $('#content').append(getPanel("Supporting Wikipedia pages <span style='font-size: 90%'>(from ASQA)</span>", titleText));
    }
    
    /* Load original NQ answer (comment out?) */
    $('#content').append(getPanel("Original NQ answer", data["nq_answer"].join(" | ")));
  }

  function getPanel(heading, body) {
    return `<div class="panel panel-default panel-inline">
      <div class="panel-heading">` + heading + `
      </div>
      <div class="panel-body">
      ` + body +`</div>
    </div>`;
  }

  function getWikiURL(title) {
    var encoded_title = title;
    for (var i=0; i<ENCODETITLE.length; i++) {
      encoded_title = encoded_title.replace(ENCODETITLE[i], ENCODEURL[i]);
    }
    return "https://en.wikipedia.org/wiki/" + encoded_title;
  }

  function sendAjax(url, data, handle){
    $.getJSON(url, data, function(response){
      handle(response.result);
    });
  }



})();
