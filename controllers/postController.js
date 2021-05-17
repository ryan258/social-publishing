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

exports.viewSingle = async function (req, res) {
  try {
    // this .id corresponds w/ the :id in our router
    let post = await Post.findSingleById(req.params.id)
    // arg0 - template
    // arg1 - data to pass to the template
    res.render('single-post-screen', { post: post })
  } catch (error) {
    res.send('404 template here')
  }
}
