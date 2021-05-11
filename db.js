const dotenv = require('dotenv')
// load in all the values in our .env file
dotenv.config()
const mongodb = require('mongodb')

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  module.exports = client.db()
  // now this won't even fire up until the db has been exported, which means it can be accessed from anywhere we require it within the app
  const app = require('./app')
  app.listen(process.env.PORT)
})
