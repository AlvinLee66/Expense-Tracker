const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  const categoryFilter = req.query.categoryFilter || 'all'
  const conditions = {}
  let totalAmount = 0
  let filterName = ''

  if (categoryFilter === 'all') {
    conditions.userId = userId
  } else {
    conditions.userId = userId
    conditions.categoryId = categoryFilter
  }

  Record.find(conditions)
    .lean()
    .sort({ _id: 'desc' })
    .then(records => {
      return Category.find()
        .lean()
        .then(categories => {
          records.forEach(record => {
            const categoryId = record.categoryId
            record.icon = categories.filter(category => category._id.equals(categoryId))[0].icon
            record.date = record.date.toISOString().split('T')[0]
            totalAmount += record.amount
          })

          if (categoryFilter !== 'all') {
            filterName = categories.filter(category => category._id.equals(categoryFilter))[0].name
          }

          return res.render('index', { records, categories, totalAmount, filterName })
        })
    })
    .catch(err => console.log(err))
})
module.exports = router