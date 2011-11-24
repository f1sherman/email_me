var http = require("http");
var url = require("url");
var querystring = require("querystring");
var mailer = require("mailer");
var config = require("./config");

var formPage = "\
  <html>\
    <body onload='setFocus()'>\
      <form action='/' method='POST'>\
        <label for='subject'>Subject</label>\
        <input name='subject' id='subject'/>\
        <br>\
        <label for='body'>Body</label>\
        <textarea name='body' id='body'></textarea>\
        <br>\
        <input type='submit'/>\
      </form>\
    </body>\
  </html>\
  <script type='text/javascript'>\
    function setFocus() {\
     document.getElementById('subject').focus();\
    }\
</script>";

function sendEmail(emailAddress, subject, body) {
  console.log('sending email to "' + emailAddress + '" with subject "' + subject + '" and body "' + body + '".');

  mailer.send({
    host : "localhost",              // smtp server hostname
    port : "25",                     // smtp server port
    domain : "localhost",            // domain used by client to identify itself to server
    to : emailAddress,
    from : config.email.from,
    subject : subject,
    body: body,
    authentication : config.smtp.auth_method,        // auth login is supported; anything else is no auth
    username : config.smtp.username,       // Base64 encoded username (even if it's not used mailer will error if it's not present)
    password : config.smtp.password        // Base64 encoded password (ditto)
  },
  function(err, result){
    if(err){ console.log(err); }
  });
}

http.createServer(function(request, response) {
  var responseContent;
  
  if(request.method === 'POST') {
    var postData = "";
    
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      var subject = querystring.parse(postData).subject;
      var body = querystring.parse(postData).body;

      sendEmail(config.email.to, subject, body);
    });

    responseContent = 'Email sent<br>' + formPage;
  } else {
    responseContent = formPage;
  }
  
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(responseContent);

  response.end();
}).listen(8888);
