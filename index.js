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
        </head>
        <body style="font-family: Helvetica,Arial,sans-serif;">
          <div style="width: 60%;
                      margin: 6% 20% 2% 20%;
                      padding-bottom: 1%;
                      align-items: center;
                      border-bottom: 1px solid #d8d8d8;
                      text-align: center;">
            <img src="https://www.usps.com/assets/images/business/advertise-with-mail/logos/growmail_logo-2.png" style="height: 100px" />
          </div>
          <div style="width: 54%;
                      align-items: center;
                      margin: 3% 21% 5% 21%;
                      padding: 2%;
                      background: #fafafa;
                      border: 1px solid #d8d8d8;
                      border-radius: 8px;">
            <div style="padding: 2% 2%;
                        display: flex;
                        align-items: center;">
              <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" 
                style=" width: 32px;
                        height: 32px;
                        border-radius: 16px;
                        margin-right: 16px;"/>
              <span style="color: #191919; font-size: medium;">${recipientName}</span>
              <span style="font-style: italic; font-size: medium; margin-left: 20px; color: #909090;">October 16th, 2018 @ 5:43PM</span>
            </div>
            <div style="width: 60%; padding: 1% 2%;">
              <pre style="color: #343434; font-style: italic; font-size: large;">${emailBody}</pre>
            </div>
          </div>
          <div style=" width: 60%;
                      align-items: center;
                      text-align: center;
                      height: 10%;
                      margin-left: 20%;
                      margin-bottom: 4%;">
            <a href="" style="width: 40%;
                              text-align: center;
                              height: 4%;
                              padding: 3% 6% 3% 6%;
                              background: #159488;
                              color: white;
                              border-radius: 8px;
                              text-decoration: none;">
              VIEW MESSAGE
            </a>
          </div>
          <div style="width: 60%;
                      text-align: center;
                      border-top: 1px solid #d8d8d8;
                      border-bottom: 1px solid #d8d8d8;
                      margin-left: 20%;
                      margin-right: 20%;
                      padding: 3% 0% 3% 0%;">
            <span style="color: #595959; font-size: medium;">You can respond to this message by replying directly</span>
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