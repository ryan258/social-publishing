const dotenv = require("dotenv")
// load in all the values in our .env file
dotenv.config()
const mongodb = require("mongodb")

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true }, function (err, client) {
  module.exports = client.db()
  const app = require("./app")
  app.listen(3000)
})
