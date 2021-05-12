const User = require('../models/User')

exports.login = function (req, res) {
  // let's create a new user obj, passing it login form data
  let user = new User(req.body)
  user.login(function (result) {
    res.send(result)
  })
}

exports.logout = function () {}

exports.register = function (req, res) {
  // console.log(req.body)
  // create a new object from the User model blueprint
  // - the req.body arg we pass will be used as the data in our model
  let user = new User(req.body)
  // now that the user has been instantiated we can register it
  // - register is defined in the model
  user.register()
  // res.send("Thanks for trying to register. 👻")
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send('Congrats, there are no errors.')
  }
}

// this is the function that will get called when someone visits the baseURL
exports.home = function (req, res) {
  res.render('home-guest')
}
