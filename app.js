const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()

let sessionOptions = session({
  secret: 'JS is groovy, daddy-o!',
  // by default this is storing session data in memory, but we can override that  here
  store: new MongoStore({ client: require('./db') }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
})

// "Hey express! Use these session options"
app.use(sessionOptions)

const router = require('./router')

// adds user submitted data to the request object
//   so we can access it from request.body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('public'))
// tell express things (name, value)
// - set views as the views DIR
app.set('views', 'views')
// - set ejs as the templating engine
app.set('view engine', 'ejs')

app.use('/', router)

// app.listen(3000)
module.exports = app
