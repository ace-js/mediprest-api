const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Collaborator = require('./collaborator')
const disagreementSchema = require('./disagreement')
const Prestation = require('./prestation')
const Performer = require('./performer')
const appointmentSchema = require('./appointment')
const patientSchema = require('./patient')

const Pts = mongoose.model('Pts', new mongoose.Schema({
  contact: {
    type: String,
    required: true
  },
  typeContact: {
    type: String,
    minlength: 1,
    maxlength: 1,
    enum: [
      'A',
      'H'
    ],
    required: true
  },
  performer: {
    type: String,
    ref: 'Performer',
    required: true
  },
  isParticularRoom: {
    type: Boolean,
    default: false
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  isValidated: {
    type: Boolean,
    default: false
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator'
  },
  appointment: {
    type: appointmentSchema,
    default: null
  },
  patient: {
    type: patientSchema,
    required: true
  },
  disagreement: {
    type: disagreementSchema,
    required: false
  },
  isInvoiced: {
    type: Boolean,
    default: false
  },
  invoicedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator'
  },
  prestation: {
    type: String,
    ref: 'Prestation'
  },
  prestationDate: {
    type: Date
  }
}).plugin(mongoosePaginate))

module.exports = Pts
