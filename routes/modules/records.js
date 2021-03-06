const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  const categories = []
  Category.find()
    .lean()
    .then(data => {
      data.forEach(category => {
        categories.push(category)
      })
      return res.render('new', { categories })
    })
    .catch(err => console.log(err))
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, categoryId } = req.body
  return Record.create({ name, date, amount, categoryId, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      const categoryId = record.categoryId
      return Category.find()
        .lean()
        .then(categories => {
          const category = categories.filter(category => categoryId.equals(category._id))[0]
          const indexForCategory = categories.findIndex(item => categoryId.equals(item._id))
          delete categories[indexForCategory]
          record.date = record.date.toISOString().split('T')[0]
          res.render('edit', { record, category, categories })
        })
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, amount, categoryId } = req.body
  return Record.findOne({ _id, userId })
    .then(record => {
      record.name = name
      record.date = date
      record.amount = amount
      record.categoryId = categoryId
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})
module.exports = router