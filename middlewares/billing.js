const {findIndex} = require('lodash')
const checkBilling = (req, res, next) => {
  if (findIndex(req.user.roles, role => role === 'Billing') === -1) {
    return res.status(403).send('Access denied, you dont have the role appropriate to perform this action')
  }

  next()
}

module.exports = checkBilling
