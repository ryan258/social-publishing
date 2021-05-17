// make a connection to the DB
const postsCollection = require('../db').db().collection('posts')
// vv pass it a simple string of text and it'll return it as a special ObjectID object vv
const ObjectID = require('mongodb').ObjectID

// vv data is postController's req.body
let Post = function (data, userId) {
  // store that data on a property inside the obj
  this.data = data
  // an array to hold our error msgs
  this.errors = []
  this.userId = userId
}

Post.prototype.cleanUp = function () {
  // make sure title and body data are strings
  if (typeof this.data.title != 'string') {
    this.data.title = ''
  }
  if (typeof this.data.body != 'string') {
    this.data.body = ''
  }
  // make sure there's no extra bogus form data being sent over
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    // best practice to not store this as a simple string of text
    author: ObjectID(this.userId)
  }
}

Post.prototype.validate = function () {
  // no blank fields
  if (this.data.title == '') {
    this.errors.push('You must provide a title.')
  }
  if (this.data.body == '') {
    this.errors.push('You must provide a body.')
  }
}

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      // save post to db and vv is an async operation
      postsCollection
        .insertOne(this.data)
        .then(() => {
          resolve()
        })
        .catch(() => {
          this.errors.push('Please try later.')
          reject(this.errors)
        })
      // to complete the promise, resolve
    } else {
      reject(this.errors)
    }
  })
}

// a function is an obj so we can add functions to functions
Post.findSingleById = function (id) {
  return new Promise(async function (resolve, reject) {
    // make sure what is entered is a string and NOT AN OBJECT
    // -- and that it IS a VALID OBJECT ID
    if (typeof id != 'string' || !ObjectID.isValid(id)) {
      reject()
      return
    }
    // if things pass to here we have a valid id value to look up in our DB
    let post = await postsCollection.findOne({ _id: new ObjectID(id) })
    if (post) {
      resolve(post)
    } else {
      reject()
    }
  })
}

module.exports = Post
