'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/index', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'grantbot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// app.post('/webhook/', function (req, res) {
//     let messaging_events = req.body.entry[0].messaging
//     console.log(messaging_events);
//     for (let i = 0; i < messaging_events.length; i++) {
//         let event = req.body.entry[0].messaging[i]
//         let sender = event.sender.id
//         if (event.message && event.message.text) {
//             let text = event.message.text
//             sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
//         }
//     }
//     res.sendStatus(200)
// })
app.post('/webhook/', function (req, res) {
     welcome();
     getstartbutton();
  
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
       
        sendTextMessage(sender, text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })



const token = "EAAHnpYruwVQBAKwKm7qdEa5yY3AB7E7hqTumA3kZAhuqWHBpfd09MjqZBxv2ruBHldtk5CmNWikpttOzS5tQyLN3evKqkr895wLozpYMh1kziD0LOCzVqdu2KCuf9r15MOKQyZB858zmjzW6stwHwhaSYZBClELJtkDApllvJgZDZD";
function welcome(){
    request({
        url:  'https://graph.facebook.com/v2.7/me/thread_settings',
        
        qs: {access_token:token},
        method: 'POST',
        json: {
                "setting_type":"greeting",
                "greeting":
                    {
                        "text":"Hi, 歡迎來到 高鐵小幫手。我是GrantBot,請輸入高鐵站名 格式如下 起程站,到達站"
                    }
                
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function getstartbutton(){
     request({
        url: 'https://graph.facebook.com/v2.7/me/thread_settings',
        qs: {access_token:token},
        method: 'POST',
        json: {
             "setting_type":"call_to_actions",
            "thread_state":"new_thread",
            "call_to_actions":[
                {
                "payload":"USER_DEFINED_PAYLOAD"
                }
            ]
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }else{
            console.log(response.body.result);
        }
    })
}





var station='[{"站名": "台中","時刻表": [{"車次": " 502","時間": "06:25"}, {"車次": "1504","時間": "06:45"}, {"車次": "1508","時間": "07:05"}, {"車次": "1510","時間": "07:17"}, {"車次": "802","時間": "07:25"}, {"車次": "1202","時間": "07:21"}, {"車次": "1602","時間": "07:40"}, {"車次": "1302","時間": "07:53"}, {"車次": "204","時間": "07:48"}, {"車次": "606","時間": "08:00"}, {"車次": "1514","時間": "08:04"}]},{"站名": "苗栗","時刻表": [{"車次": " 502","時間": "06:44"}, {"車次": "1504","時間": "07:05"}, {"車次": "1508","時間": "07:25"}, {"車次": "1510","時間": "07:37"}, {"車次": "802","時間": "07:45"}, {"車次": "1514","時間": "08:24"}]}]';
var trainGo='[{"車次": "502","行駛日":"1234567"}, {"車次": "1504","行駛日":"12345"},{"車次": "1508","行駛日":"12345"},{"車次": "1510","行駛日":"1"},{"車次": "802","行駛日":"1234567"},{"車次": "1202","行駛日":"12345"},{"車次": "1602","行駛日":"12345"},{"車次": "1302","行駛日":"12345"},{"車次": "204","行駛日":"1234567"},{"車次": "606","行駛日":"1234567"},{"車次": "1514","行駛日":"12345"}]';

function sendTextMessage(sender, text) {
    var inputText=text.split(",");
    var start=inputText[0];
    var end=inputText[1];
    var startDataIndex,endDataIndex,x,y;

    var d=new Date();
    var stationParse=JSON.parse(station);
    var trainGoParse=JSON.parse(trainGo);
    var trainGoResult=new Array();
    
     for(let i=0;i<stationParse.length;i++){
            if(start==stationParse[i].站名){
                startDataIndex=i;
            }
            if(end==stationParse[i].站名){
                endDataIndex=i;
            }
    }

    for(let i=0;i<trainGoParse.length;i++){
        let temp=trainGoParse[i].行駛日;
        if(temp.indexOf(d.getDay)>=0){
            trainGoResult.push(temp);
        }
    }
     x =stationParse[0].時刻表.length
     y=stationParse[1].時刻表.length
    var resultTime=start+"=>"+end;
    // while(x>=-1||y>=-1){
    //     let i=trainGoResult.indexOf(stationParse[startDataIndex].時刻表[x].車次);
    //     let j=trainGoResult.indexOf(stationParse[startDataIndex].時刻表[y].車次);
    //     if(i>=0 && j>=0 ){
    //         resultTime+="\n"+stationParse[startDataIndex].時刻表[x].車次+"  "+stationParse[startDataIndex].時刻表[x].時間+"=>"+stationParse[endDataIndex].時刻表[y].時間
    //     }
    //     x--;
    //     y--;
    // }

  
    
    // stationParse[startDataIndex].時刻表[j].車次
    //     stationParse[endDataIndex].時刻表[j].車次
  
    // var json='[ { "車次": "502", "時刻表": [ {  "地點": "台中","時間": "06:25"}, { "地點": "苗栗", "時間": "06:44"  } ] }]';
    // var location=new Array('台中','苗栗','新竹','桃園','板橋','台北','南港');
    // var data=JSON.parse(json);
    // var ans;
    //  location.map(function(value){
    //      if(text==value){
    //         ans=text;
    //      }
    //  })
    //  if(ans!=""){
    //       ans="success"
    //       for (let i=0;i<data[0].時刻表.length;i++){
    //             if(text==data[0].時刻表[i].地點){
    //                 ans=data[0].時刻表[i].時間;
    //                 break
    //             }
    //         }
    //  }else{
    //      ans="error"
    //  }
            
    let messageData = { text: start+"  "+end+" "+x+" "+y }
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



