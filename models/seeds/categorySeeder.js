if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const db = require('../../config/mongoose')

const CATEGORY = [
  { 
    name: '家居物業',
    icon: 'fas fa-house fa-2x'
  },
  {
    name: '交通出行',
    icon: 'fas fa-car-side fa-2x'
  },
  {
    name: '休閒娛樂',
    icon: 'fas fa-laugh-beam fa-2x'
  },
  {
    name: '餐飲食品',
    icon: 'fas fa-utensils fa-2x'
  },
  {
    name: '其他',
    icon: 'fas fa-ellipsis-h fa-2x'
  }
]

db.once('open', () => {
  return Promise.all(Array.from(CATEGORY, category => {
    return Category.create(category)
  }))
  .then(() => {
    console.log('Category create was done！')
    process.exit()
  })
  .catch(err => console.log(err))
})
