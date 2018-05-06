// client-side js
// run by the browser each time your view template is loaded

$(document).ready(function() {
  $("#field").on("keypress", function(e) {
    if (e.which == 13) {             
      $.ajax({
        url: '//en.wikipedia.org/w/api.php',
        data: {action: 'query', list: 'search', srsearch: v, format: 'json', srprop: 'snippet'},
        dataType: 'jsonp',
        success: function(json) {
          var html= json.query.search;           
          var line ="";
          var url = "";
          html.forEach(function(val) {
           url = "https://en.wikipedia.org/?curid=" + val.pageid;
           line += "<a href=" + url + " class='answer' target='_blank'>" + "<h3>" + val.title + "</h3></br><span>" + val.snippet + "</span>" + "</a></br>";           
         });
          document.getElementById("block").style.cssText = "margin-top: 20px";          
          $("#info").html(line);
        } 
      });
    };
    
  });    
});

var v = "";
function textIt(obj) {  
  v = obj.value; 
};