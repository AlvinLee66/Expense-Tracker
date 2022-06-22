const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ _id: 'desc' })
    .then(records => {
      return Category.find()
        .lean()
        .then(categories => {
          records.forEach(record => {
            const categoryId = record.categoryId
            record.icon = categories.filter(category => categoryId.equals(category._id))[0].icon
            record.date = record.date.toISOString().split('T')[0]
          })
          return res.render('index', { records })
        })
    })
    .catch(err => console.log(err))
})
module.exports = router