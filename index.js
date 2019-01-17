const config = require('config')
const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')

const router = require('./routes/router')

const app = express()
const {MONGO_PASSWORD, MONGO_USER, PORT} = process.env // get env variables to auth to db

mongoose.connect(config.get('db.host'), {user: MONGO_USER, pass: MONGO_PASSWORD}).then(() => console.log('Connected to MongoDB..'))
  .catch(err => console.log('Unexpected error..', err.message))

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
})
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token')
  res.header('Access-Control-Expose-Headers', 'x-auth-token')
  next()
})

app.use(morgan('combined', {
  stream: accessLogStream,
  skip: function (req, res) { return res.statusCode < 400 }
})) // logg toutes les requests avec status 4** ou 5**
app.use('/', router) // tout ce qui commence par / est géré par router

const port = PORT || 5000
app.listen(port, () => {
  console.log('Listening on port ', port)
})
