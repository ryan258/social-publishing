const express = require('express')
const app = express()

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

app.listen(3000)
