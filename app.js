const express = require('express')
const exphbs = require('express-handlebars')

const mysql = require('./middleware/db')
const indexRouter = require('./routers/index')
const uploadRouter = require('./routers/upload')
const preordersRouter = require('./routers/preorders')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.use('/', express.static(__dirname + '/src'))

app.locals.connection = mysql

app.use(indexRouter)
app.use(uploadRouter)
app.use(preordersRouter)

app.listen(port, () => {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    const currentdate = new Date();
    const datetime = 
    `Started: ${(currentdate.getDay() + 1)}/${(currentdate.getMonth() + 1)}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`
    console.log(datetime)
    console.log('Server running on port ' + port)
})