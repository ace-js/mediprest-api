const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const {pts} = require('./../../constants')

module.exports = {
  pts_validation: {
    query: {
      contactType: Joi.string().valid([pts.HOSPI, pts.AMBU, pts.NONE]).allow(null),
      status: Joi.string().valid([pts.VALIDATED, pts.DISAGREED, pts.NOT_TRAITED, pts.NONE]).allow(null),
      sortBy: Joi.string().valid([pts.CONTACT, pts.PATIENT, pts.PRESTATION_DATE, pts.CONTACT_TYPE, pts.PRESTATION]).allow(null),
      page: Joi.number().min(1).allow(null),
      limit: Joi.number().min(5).max(100).allow(null),
      sortDirection: Joi.string().valid([pts.ASC, pts.DESC]).allow(null),
      isInvoiced: Joi.boolean().allow(null).default(false),
      dateStart: Joi.date().allow(null),
      dateEnd: Joi.date().allow(null)
    },
    params: {
      inami: Joi.string().required()
    }
  },
  pts_billing: {
    query: {
      contactType: Joi.string().valid([pts.HOSPI, pts.AMBU, pts.NONE]).allow(null),
      status: Joi.string().valid([pts.VALIDATED, pts.DISAGREED_NT, pts.DISAGREED_HANDLED_BY_ME, pts.TRAITED]),
      sortBy: Joi.string().valid([pts.CONTACT, pts.PATIENT, pts.PRESTATION_DATE, pts.CONTACT_TYPE, pts.PRESTATION]).allow(null),
      page: Joi.number().min(1).allow(null),
      limit: Joi.number().min(5).max(100).allow(null),
      sortDirection: Joi.string().valid([pts.ASC, pts.DESC]).allow(null),
      isInvoiced: Joi.boolean().allow(null).default(false),
      dateStart: Joi.date().allow(null),
      dateEnd: Joi.date().allow(null)
    },
    params: {
      collabId: Joi.objectId().required()
    }
  },
  createPts: {
    body: {
      isParticularRoom: Joi.boolean().allow(null).default(false),
      isEmergency: Joi.boolean().allow(null).default(false),
      isValidated: Joi.boolean().allow(null).default(false),
      isInvoiced: Joi.boolean().allow(null).default(false),
      contact: Joi.string().required(),
      typeContact: Joi.string().valid([pts.HOSPI, pts.AMBU]),
      performer: Joi.string().min(6).max(6).required(),
      validatedBy: Joi.objectId().required(),
      appointment: Joi.object().keys({
        code: Joi.string().required(),
        label: Joi.string().required()
      }).allow(null),
      patient: Joi.object().keys({
        _id: Joi.objectId().required(),
        name: Joi.string().required(),
        firstname: Joi.string().required(),
        birthdate: Joi.date().required(),
        photoUrl: Joi.string().uri().required(),
        sexe: Joi.string().valid('M', 'F')
      }).required(),
      disagreement: Joi.object().allow(null),
      invoicedBy: Joi.objectId().allow(null),
      prestation: Joi.string().min(6).max(6).required(),
      prestationDate: Joi.date().required()
    }
  },
  updatePts: {
    params: {
      id: Joi.objectId().required(),
      ptsId: Joi.objectId().required()
    },
    body: {
      pts: Joi.object().required()
    }
  }
}
