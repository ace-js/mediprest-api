const forge = require('node-forge')
const _ = require('lodash')

const verifyPasswordHash = async (password, passwordHash, passwordSalt) => {
  const hmac = await forge.hmac.create()
  hmac.start('sha512', passwordSalt)
  hmac.update(password)
  const hash = await hmac.digest().toHex()
  return await _.eq(passwordHash, hash)
}

const createPasswordHash = (password) => {
  const hmac = forge.hmac.create()
  const passwordSalt = forge.random.getBytesSync(16)
  hmac.start('sha512', passwordSalt)
  hmac.update(password)
  const passwordHash = hmac.digest().toHex()
  return {passwordSalt, passwordHash}
}

module.exports = {
  createPasswordHash,
  verifyPasswordHash
}
