const bcrypt = require('bcryptjs')
// ^^ for hashing passwords
const usersCollection = require('../db').db().collection('users')
// ^^ now we can perform CRUD operations on this collection
const validator = require('validator')
// user blueprint / constructor function
let User = function (data) {
  // store the user data
  this.data = data
  this.errors = []
}
//! Using this prototype syntax JS won't need to create a copy of this function for every instance. Each will just "have access" to this method
// Validate user inputs are strings
User.prototype.cleanUp = function () {
  if (typeof this.data.username != 'string') {
    this.data.username = ''
  }
  if (typeof this.data.email != 'string') {
    this.data.email = ''
  }
  if (typeof this.data.password != 'string') {
    this.data.password = ''
  }

  // Ignore/get rid of any bogus properties by overriding this.data
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

// this way all objects would have access to the function sparing the computer from having to render each obj with its own function

User.prototype.validate = function () {
  if (this.data.username == '') {
    this.errors.push('You must provide a username 😡')
  }
  if (this.data.username != '' && !validator.isAlphanumeric(this.data.username)) {
    this.errors.push('Username can only contain letters and numbers!')
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push('You must provide an email 😡')
  }
  if (this.data.password == '') {
    this.errors.push('You must provide a password 😡')
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push('Your password must be at least 12 characters long.')
  }
  if (this.data.password.length > 50) {
    this.errors.push('The maximimum password size is 50 characters.')
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push('Your username must be at least 3 characters long.')
  }
  if (this.data.username.length > 30) {
    this.errors.push('The maximimum username size is 30 characters.')
  }
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    // here we can perform async operations that will take some time to complete
    // - then when they are complete, we call either, resolve or reject
    this.cleanUp()
    // vvv perform CRUD operations on this collection
    // - arg0 - what we're trying to find
    // - arg1 - callback function
    //   if a user is found it'll pass it as attempted user
    //! vv this will take some time
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        // compareSync
        // - arg0 - the plain text password user is trying to login with
        // - arg1 - this attempted user's hash value
        if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
          // console.log('congrats! ')
          resolve('congrats!')
        } else {
          // console.log('invalid user/password')
          reject('invalid user/password')
        }
      })
      .catch(function () {
        reject('Please try again later.')
      })
  })
}

User.prototype.register = function () {
  // Step #1: Validate user data
  this.cleanUp()
  this.validate()
  // Step #2: Only if there are no validation errors
  // then save the user data into a database
  if (!this.errors.length) {
    // hash user password - in 2 steps
    // 1 - create a salt
    let salt = bcrypt.genSaltSync(10)
    // 2 - generate the hash
    //   - arg0 - the value you want to hash
    //   - arg1 - salt value
    this.data.password = bcrypt.hashSync(this.data.password, salt)
    // 3 - insert the updated data into the db
    usersCollection.insertOne(this.data)
  }
}

module.exports = User
