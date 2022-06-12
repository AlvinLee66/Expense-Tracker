if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record')
const recordList = require('./record.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  recordList.forEach(record => {
    Record.create(record)
  })
  console.log('record create was done！')
})
