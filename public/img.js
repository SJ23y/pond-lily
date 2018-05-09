$(document).ready(function() {
  $("#field").on("keypress", function(e) {
    if (e.which == 13) {
    var url = 'https://pond-lily.glitch.me/image/' + v;
    window.location.replace(url);
    } 
                  });
    
    
  });    


var v = "";
function textIt(obj) {  
  v = obj.value; 
};