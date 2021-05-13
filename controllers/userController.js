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
      } // since updating data in a db is asynchronous action we can't guarantee timing
      // res.send(result)
      req.session.save(function () {
        // what we want to run when the save is complete
        res.redirect('/')
      })
    })
    .catch(function (e) {
      // res.send(e)
      // - arg0 - array of error messages to build on to
      // - arg1 - actual message you want to add on to the array
      //   in this case e = the message it rejects with
      req.flash('errors', e)
      req.session.save(function () {
        res.redirect('/')
      })
    })
}

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/')
  })
  // res.send('You are now logged out ')
}

exports.register = function (req, res) {
  // console.log(req.body)
  // create a new object from the User model blueprint
  // - the req.body arg we pass will be used as the data in our model
  let user = new User(req.body)
  // now that the user has been instantiated we can register it
  // - register is defined in the model
  // vv now that this is an async function we need to make sure to give it a chance to actually complete
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username }
      req.session.save(function () {
        res.redirect('/')
      })
    })
    .catch((regErrors) => {
      // res.send(user.errors)
      regErrors.forEach(function (error) {
        req.flash('regErrors', error)
      })
      // wait for dataabse action to complete before redirecting
      req.session.save(function () {
        res.redirect('/')
      })
    })
}

// this is the function that will get called when someone visits the baseURL
exports.home = function (req, res) {
  if (req.session.user) {
    res.render('home-dashboard', {
      username: req.session.user.username
    })
  } else {
    res.render('home-guest', { errors: req.flash('errors'), regErrors: req.flash('regErrors') })
  }
}
