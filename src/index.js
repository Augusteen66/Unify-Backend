const express = require('express')
const userRouter = require('./routers/user')
const programFormRouter = require('./routers/programForm')
const donorRouter = require('./routers/donor')
const applicationFormRouter = require('./routers/Application')
require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(programFormRouter)
app.use(donorRouter)
app.use(applicationFormRouter)

app.listen(port, () => {
    console.log("Server is up on port 5000!")
})

const programForm = require('./models/programForm')
const User = require('./models/user')