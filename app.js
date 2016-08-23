var http = require('http')
var Bot = require('messenger-bot')

var bot = new Bot({
  token: 'EAAHnpYruwVQBAI5wZCdL8wEGegQ50R3tkbcdafWck6r206pA8xVRyPjmKG7tIJZCGD7ifwZCoO8qITluWGQ5DJ7diAq5UZB7tCANommOIC6brp93b7ljTZCberBtY0Bq3KrCzrxQ5brZASY65KMGyQ97OeNmmqeiaELaY1gkK39AZDZD',
  verify: 'grantbot',
  app_secret: '2673dfa5a630efb487245039b42f1083'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  var text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')