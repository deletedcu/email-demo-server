const sendgrid = require("@sendgrid/mail");
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
require('dotenv').config();

sendgrid.setApiKey(process.env.API_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(3001, () => {
  console.log('server is running on port 3001');
});

app.post('/send', async function (req, res) {
  var { recipientName, email, emailSubject, emailBody } = req.body;
  var body = "<p>Hi, " + recipientName + "</p>" + emailBody;
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