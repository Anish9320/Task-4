require("dotenv").config()
const express = require("express")
const { Auth } = require("./middleware/authCheck")
const { router } = require("./routes/router")
const cors = require("cors")
const app = express()

app.use(cors({
    origin: ['http://localhost:3000','https://sspd-frontend.vercel.app'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))
app.use(Auth) //-> Middleware
//body data
app.use(express.json({limit: '50mb'}))                         
app.use(express.urlencoded({limit: '50mb', extended:true}))


app.use("/api",router)
app.listen(process.env.PORT, ()=>{
    console.log("Server Running at "+process.env.PORT)
})