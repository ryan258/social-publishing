const User = require("../models/User")

exports.login = function () {}

exports.logout = function () {}

exports.register = function (req, res) {
  // console.log(req.body)
  // create a new object from the User model blueprint
  let user = new User(req.body)
  user.register()
  // res.send("Thanks for trying to register. 👻")
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Congrats, there are no errors.")
  }
}

exports.home = function (req, res) {
  res.render("home-guest")
}
