const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

app.use(bodyparser.json({ limit: '10mb' }))
app.use(bodyparser.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

app.use('/users', require('./routes/login'))
app.use('/course',require('./routes/course'))
app.use('/lesson', require('./routes/lesson'))
app.use('/exercise',require('./routes/exercise'))
app.use('/enrollment', require('./routes/enrollment'))
app.use('/progress', require('./routes/progress'))
app.use('/exercise-results', require('./routes/exerciseResult'))


app.use(errorHandler)
module.exports = app