var http = require('http')
var Bot = require('messenger-bot')
var bodyParser = require('body-parser')
var bot = new Bot({
  token: 'EAAHnpYruwVQBAMdqY3MzN0hNUYefZAnVOOwT9mwOdmK6ZBJO0Ic1661FvY46YeJZCKaMIdYSoOHPzncIS9r4jWzuegeZBZAOPivUYRIfReNcNJpVLgclVFSFr7Ef6DNAqSX8vYPqI57lMT1MC7QauZBiFncLZCyZAwG09EosXjEOxgZDZD',
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

    reply("hi", (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000.')