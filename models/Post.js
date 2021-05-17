// make a connection to the DB
const postsCollection = require('../db').db().collection('posts')
// vv pass it a simple string of text and it'll return it as a special ObjectID object vv
const ObjectID = require('mongodb').ObjectID
// vv bring in our user model so we can access the users gravatar
const User = require('./User')

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
    // let post = await postsCollection.findOne({ _id: new ObjectID(id) })
    //! aggregate() is great for when you need to perform multiple/complex operations - we give it an array of DB operations - and each operation is an object
    // - toArray() returns a promise
    let posts = await postsCollection
      .aggregate([
        { $match: { _id: new ObjectID(id) } },
        // look up documents from another collection
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorDocument' // mongodb will use this name when it creates a virtual field
          }
        },
        {
          // $project allows us to spell out the resulting fields we want the object to have
          $project: {
            title: 1,
            body: 1,
            createdDate: 1,
            author: {
              $arrayElemAt: ['$authorDocument', 0]
            }
          }
        }
      ])
      .toArray()

    // clean up author property in each post object
    posts = posts.map(function (post) {
      // manipulate the current item in the array
      post.author = {
        username: post.author.username,
        // bc .getAvatar() ran in User.js
        avatar: new User(post.author, true).avatar
      }
      return post
    })

    if (posts.length) {
      console.log(posts[0])
      resolve(posts[0])
    } else {
      reject()
    }
  })
}

module.exports = Post
