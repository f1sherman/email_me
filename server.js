var http = require("http");
var url = require("url");
var querystring = require("querystring");
var mailer = require("mailer");
var config = require("./config");

var formPage = "\
  <meta name='viewport' content='width=device-width, initial-scale=1.0'> \
  <html>\
    <body>\
      <form action='/' method='POST'>\
        <label for='subject' style='display: block; clear: both'>Subject</label>\
        <input name='subject' id='subject' autofocus style='width: 100%; font-size: 1.5em'/>\
        <br>\
        <label for='body' style='display: block; clear: both'>Body</label>\
        <textarea name='body' id='body' style='width: 100%; font-size: 1.5em'></textarea>\
        <br>\
        <input type='submit' style='font-size: 1em'/>\
      </form>\
    </body>\
  </html>";

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
