const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Collaborator = require('./collaborator')
const Prestation = require('./prestation')

const Performer = mongoose.model(
  'Performer',
  new mongoose.Schema({
    _id: String,
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Collaborator'
    },
    delegates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collaborator'
      }
    ],
    prestations: [
      {
        _id: {
          type: String,
          ref: 'Prestation'
        },
        amount: {
          type: Number
        },
        isFavorite: {
          type: Boolean,
          default: false
        }
      }
    ]
  }).plugin(mongoosePaginate)
)

module.exports = Performer
