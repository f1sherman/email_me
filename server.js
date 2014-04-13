var http = require("http");
var url = require("url");
var querystring = require("querystring");
var nodemailer = require("nodemailer");
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

  var transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

  var message = {
    to : emailAddress,
    from : config.email.from,
    subject : subject,
    body: body
  };

  transport.sendMail(message, function(error) {
    if(error) {
      console.log('Error occured');
      console.log(error.message);
      return;
    }
    console.log('Message sent successfully!');
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
