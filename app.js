const express = require("express")
const app = express()

const router = require("./router")

// adds user submitted data to the request object
//   so we can access it from request.body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// tell express things (name, value)
app.use(express.static("public"))
app.set("views", "views")
app.set("view engine", "ejs")

app.use("/", router)

app.listen(3000)
