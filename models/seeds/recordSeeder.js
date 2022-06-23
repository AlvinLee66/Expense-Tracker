const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const recordList = require('./record.json').results
const db = require('../../config/mongoose')

const SEED_USER = {
  name: '老爸',
  email: 'feather@example.com',
  password: '12345678'
}

db.once('open', () => {
  return bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      return Promise.all(Array.from(recordList, record => {
        return Category.findOne({ name: record.category })
          .lean()
          .then(category => {
            return Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              categoryId: category._id,
              userId: user._id
            })
          })
      }))
    })
    .then(() => {
      console.log('Record create was done！')
      process.exit()
    })

})
