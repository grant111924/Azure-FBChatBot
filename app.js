var express=require('express');
var app=express();

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'grantbot') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
    res.send("good");
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

module.exports = app;