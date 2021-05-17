const Post = require('../models/Post')

exports.viewCreateScreen = function (req, res) {
  res.render('create-post')
}

exports.create = function (req, res) {
  // req.body will be the submitted form data, req.session for the user data
  let post = new Post(req.body, req.session.user._id)
  // vv this will create a promise, so we can chain on to it
  post
    .create()
    .then(function () {
      res.send('new post created')
      // redirect use to the new post's url w/ a success flash message
    })
    .catch(function (errors) {
      res.send(errors)
    })
}
