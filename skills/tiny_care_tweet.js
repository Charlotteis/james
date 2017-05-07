module.exports = function(controller) {
  const Request = require('request')
  const Twitter = require('twitter')
  const client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  })
  
  const USER_TO_FOLLOW = '797869498757955589'
  const CHANNEL_TO_POST = 'tinycare'

  const bot = controller.spawn({
    token: process.env.clientId
  })
  
  client.stream('statuses/filter', {follow: USER_TO_FOLLOW},  function(stream) {
    stream.on('data', function(tweet) {
      if (isDirectTweet(tweet)) {
        bot.api.chat.postMessage({
          'token': process.env.botToken,
          'channel': CHANNEL_TO_POST,
          'text': `@charlotteis ${tweet.text}`
        }, function(error, response) {
            if (error) throw error
        })
      }
    })

    stream.on('error', function(error) {
      throw error
    })
  })
  
  function isDirectTweet (tweet) {
    return (isNotRetweet(tweet) && isNotReply(tweet) && isNotQuoteTweet(tweet))
  }
  
  function isNotRetweet (tweet) {
    return !tweet.retweeted_status
  }
  
  function isNotReply (tweet) {
    return (tweet.in_reply_to_user_id === null)
  }
  
  function isNotQuoteTweet (tweet) {
    return (tweet.is_quote_status === false)
  }
}
