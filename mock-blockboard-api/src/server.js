#!/usr/bin/env node
import express from "express"
import cors from "cors"
import blackboardroutes from "./blackboard/routes"
import gitlabroutes from "./gitlab/routes"


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

blackboardroutes(app)
gitlabroutes(app)

app.get("/", (req, res) => {
  res.send("Hello World")
})

const port = process.env.PORT || 5050
app.listen(port, () => console.log(`server running on port ${port}`))
module.exports = app