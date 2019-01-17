const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const Department = require('./department')
const Performer = require('./performer')

const collabSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  passwordSalt: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    enum: ['Performer', 'Delegate', 'Billing'],
    required: true
  }],
  performers: [{
    type: String,
    ref: 'Performer'
  }],
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }
}).plugin(mongoosePaginate)

collabSchema.methods.generateAuthToken = () => jwt.sign({
    _id: this._id,
    roles: this.roles
  }, config.get('jwtPrivateKey'), { expiresIn: '2h' })

const Collaborator = mongoose.model('Collaborator', collabSchema)

module.exports = Collaborator
