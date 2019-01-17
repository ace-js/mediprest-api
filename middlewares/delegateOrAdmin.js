const { findIndex } = require('lodash')

const Performer = require('./../models/performer')

const isDelegateOrAdmin = async (req, res, next) => {
    const performer = await Performer.find({ collaborator: req.params.id })
    if ((req.user._id !== req.params.id) && (findIndex(performer.delegates, delegate => delegate === req.user._id) === -1)) {
       console.log('403')
        return res.status(403).send('Access denied, you cannot perfom this action')
    }

    next()
}

module.exports = isDelegateOrAdmin
