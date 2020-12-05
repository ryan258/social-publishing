const validator = require("validator")
// user blueprint
let User = function (data) {
  this.data = data
  this.errors = []
}

// Validate user inputs are strings
User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  if (typeof this.data.email != "string") {
    this.data.email = ""
  }
  if (typeof this.data.password != "string") {
    this.data.password = ""
  }

  // Ignore any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    password: this.data.password.trim().toLowerCase(),
    email: this.data.email
  }
}

// this way all objects would have access to the function sparing the computer from having to render each obj with its own function

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username 😡")
  }
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
    this.errors.push("Username can only contain letters and numbers!")
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide an email 😡")
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password 😡")
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Your password must be at least 12 characters long.")
  }
  if (this.data.password.length > 100) {
    this.errors.push("The maximimum password size is 100 characters.")
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Your username must be at least 3 characters long.")
  }
  if (this.data.username.length > 30) {
    this.errors.push("The maximimum username size is 30 characters.")
  }
}

User.prototype.register = function () {
  // Step #1: Validate user data
  this.cleanUp()
  this.validate()
  // Step #2: Only if there are no validation errors
  // then save the user data into a database
}

module.exports = User
