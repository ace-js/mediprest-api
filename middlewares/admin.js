const isAdmin = (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return res.status(403).send('Access denied, you cannot perfom this action for another person')
  }

  next()
}

module.exports = isAdmin
