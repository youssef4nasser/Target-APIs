import dotenv from "dotenv"
import express from "express"
import {bootstrap} from "./src/bootstrap.js"
import cors from 'cors'
import { connectionBD } from "./DataBase/connectionDB.js"

const app =  express()

// middleware to parse the body of request into json format
app.use(express.json())
// middleware for cross-origin resource sharing (CORS)
app.use(cors())
// load environment variables
dotenv.config()
// connection to database
connectionBD()
// bootstrap application
bootstrap(app)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`app listening on port ${port}!`))
