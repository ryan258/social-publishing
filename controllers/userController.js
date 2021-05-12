const User = require('../models/User')

exports.login = function (req, res) {
  // let's create a new user obj, passing it login form data
  let user = new User(req.body)
  // v here we'll use the promise
  //   then - if the promise resolve - and receive the value the promise resolved with in the argument
  //   catch - if the promise rejects
  user
    .login()
    .then(function (result) {
      req.session.user = {
        // this info will be unique to this specific user
        username: user.data.username,
        favColor: 'blue'
      }
      res.send(result)
    })
    .catch(function (e) {
      res.send(e)
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
  if (req.session.user) {
    res.render('home-dashboard', {
      username: req.session.user.username
    })
  } else {
    res.render('home-guest')
  }
}
