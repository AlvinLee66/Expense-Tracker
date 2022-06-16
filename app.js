const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Record = require('./models/record')
const Category = require('./models/category')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(err => console.log(err))
})

app.get('/records/new', (req, res) => {
  const categories = []
  Category.find()
    .lean()
    .then(data => {
      data.forEach(category => {
        categories.push(category)
      })
      console.log(categories)
      return res.render('new', { categories })
    })
    .catch(err => console.log(err))
})

app.post('/records', (req, res) => {
  const { name, date, amount, category } = req.body
  return Record.create({ name, date, amount, category })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => {
      const categoryId = record.category
      return Category.find()
        .lean()
        .then(categories => {
          console.log(categories)
          console.log(typeof(categoryId))
          const category = categories.filter(category => category._id == categoryId)[0]
          console.log(category)
          record.date = record.date.toISOString().split('T')[0]
          res.render('edit', { record, category, categories })
        })
    })

    .catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})