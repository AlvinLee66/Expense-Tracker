const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

router.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort({ _id: 'desc' })
    .then(records => {
      records.forEach(record => {
        record.date = record.date.toISOString().split('T')[0]
      })
      res.render('index', { records })
    })
    .catch(err => console.log(err))
})
module.exports = router