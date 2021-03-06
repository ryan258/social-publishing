const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const app = express()

let sessionOptions = session({
  secret: 'JS is groovy, daddy-o!',
  store: new MongoStore({ client: require('./db') }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
})

app.use(sessionOptions)

app.use(flash())

// our custom middleware
app.use(function (req, res, next) {
  //! runs on every request

  // make current user id available on the req object
  // - so no matter what controller function we're in, we'll know there's a visitorId property on the request object
  if (req.session.user) {
    req.visitorId = req.session.user._id
  } else {
    req.visitorId = 0
  }

  //! make user session data available from within view templates

  // locals will be an obj available within our ejs templates, so we'll make our session.user obj available
  // saves us from having to pass in user data to our controllers
  res.locals.user = req.session.user
  next()
})

const router = require('./router')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app
