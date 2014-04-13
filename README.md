# EmailMe: a simple app for emailing notes to yourself

### Description

Trivial nodejs app that will send emails to a pre-defined email address.  Requires a local smtp server and npm to install the mailer package.  It's been tested under node 0.6.2 but will likely run on other versions.

I created this project as an exercise to learn about nodejs but I've ended up using it almost daily.

### Installation

Clone the repo 
  
    git clone git://github.com/f1sherman/email_me.git

Copy the config template to config.js 
  
    cp config.js.template config.js

Edit config.js and add your own values  
Install mailer 
  
    npm install nodemailer

Start the app 

    node server.js &

### License

EmailMe is released under the [MIT License](http://www.opensource.org/licenses/MIT)
