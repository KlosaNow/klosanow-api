import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import morgan from 'morgan'

dotenv.config()

const port = process.env.PORT
const connect = async () => {
    process.env.NODE_ENV === 'development' ?
        await mongoose.connect(`${process.env.MONGO_DB_URI}`)
            .then(() => { console.log("Local Db connected successfully!"), { useNewUrlParser: true } })
            .catch(err => { console.log(err) })
        : await mongoose.connect(`${process.env.MONGO_DB_URI_CLOUD}`)
            .then(() => { console.log("Cluster Db connected successfully!") })
            .catch(err => { console.log(err) })
}

connect();

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))

app.get("/", (request, response) => {
    response.json({message: "Welcome to the lessons microservice!"})
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})