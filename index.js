const sendgrid = require("@sendgrid/mail");
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
require('dotenv').config();

sendgrid.setApiKey(process.env.API_KEY);

app.set('port', (process.env.PORT || 3001))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
});

app.get('/', function (req, res) {
  res.send({ success: true, message: 'this is a node backend'});
});

app.post('/send', async function (req, res) {
  var { recipientName, email, emailSubject, emailBody } = req.body;
  var body = `
    <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            * {
              box-sizing: border-box;
            }
            body {
              padding: 0;
              margin: 0;
              font-family: Helvetica,Arial,sans-serif;
            }
            .wrapper {
              max-width: 800px;
              margin: 0 auto;
            }
            .top-logo {
              width: 100%;
            }
            .top-logo img {
              display: block;
              margin: 40px auto 20px;
              max-width: 80%;
              height: auto;
              max-height: 120px;
            }
            .message-box-wrapper {
              padding: 40px 20px 0;
              border-top: solid 1px rgb(231, 235, 239);
              border-bottom: solid 1px rgb(231, 235, 239);
            }
            .message-box {
              padding: 20px;
              border: solid 1px rgb(240, 244, 246);
              border-radius: 4px;
              background: rgb(253, 253, 253);
              width: 100%;
            }
            .message-cta {
              text-align: center;
            }
            .btn-view-message {
              background: #159488;
              color: white;
              border-radius: 4px;
              text-decoration: none;
              padding: 20px 30px;
              margin: 40px 0;
              letter-spacing: 1px;
              display: inline-block;
            }
            .footer-note {
              border-bottom: solid 1px rgb(231, 235, 239);
              text-align: center;
              padding: 40px 20px;
              line-height: 1.4;
            }
            .message-info {
              display:-webkit-flex;
              display:-ms-flexbox;
              display: flex;
              align-items: center;
            }
            .message-info .author {
              display:-webkit-flex;
              display:-ms-flexbox;
              display: flex;
              align-items: center;
              margin-right: 12px;
            }
            .message-info .author img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 12px;
            }
            .message-info .author .sender {
              color: #191919;
            }
            .message-info .created {
              font-style: italic;
              color: #909090;
            }
            .message-box .message {
              font-style: italic;
              font-size: 1.3em;
              white-space: pre-wrap;
              margin-bottom: 0;
            }
            @media screen and (max-width: 600px) {
              .message-info {
                flex-direction: column;
                align-items: flex-start;
              }
              .message-info .created {
                font-size: 0.7em;
                margin-top: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="top-logo">
              <img src="https://www.usps.com/assets/images/business/advertise-with-mail/logos/growmail_logo-2.png" />
            </div>
            <div class="message-box-wrapper">
              <div class="message-box">
                <div class="message-info">
                  <div class="author">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" />
                    <span class="sender">${recipientName}</span>
                  </div>
                  <span class="created">October 16th, 2018 @ 5:43PM</span>
                </div>
                <pre class="message">${emailBody}</pre>
              </div>
              <div class="message-cta">
                <a class="btn-view-message">VIEW MESSAGE</a>
              </div>
            </div>
            <div class="footer-note">
              <span>You can respond to this message by replying directly to this email</span>
            </div>
          </div>
        </body>
      </html>`;
  const msg = {
    to: email,
    from: "test@test.com",
    subject: emailSubject,
    html: body
  };
  await sendgrid.send(msg);
  res.contentType('application/json');
  res.send({ success: true });
})