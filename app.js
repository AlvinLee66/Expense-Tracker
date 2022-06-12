const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

require('./config/mongoose')

app.get('/', (req, res) => {
  res.send("Hello~")
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})