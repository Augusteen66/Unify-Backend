const express = require('express')
const userRouter = require('./routers/user')
const programFormRouter = require('./routers/programForm')
const donorRouter = require('./routers/donor')
const applicationFormRouter = require('./routers/Application')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 5000

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

// const main = async () => {
//     // const form = await programForm.findById('606fdc7b6fa0ee0fa48ccf5f')
//     // await form.populate('owner').execPopulate()  //To populate based on owner
//     // console.log(form.owner)

    // // Find tasks by user
    // const user = await User.findById('606fdc5d6fa0ee0fa48ccf5d')
    // await user.populate('myForms').execPopulate()
    // console.log(user.myForms)
// }

// main()