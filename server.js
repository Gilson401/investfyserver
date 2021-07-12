const express = require('express')

var cors = require('cors')
const db = require("./app/models");

// const config = require('config')
// const connectDB = require('./config/db');

const app = express()
require('dotenv').config()
db.sequelize.sync();

const PORT = process.env.PORT || 3005;

// Init Middleware
app.use(cors())
app.use(express.json())

//  connectDB()

app.get('/', (req, res) => res.send('Olá, este servidor do chuck norris está ON.'))
app.use('/auth', require('./routes/api/auth'))
app.use('/piada', require('./routes/api/piada'))
app.use('/user', require('./routes/api/user'))

const server = app.listen(PORT, () => { console.log(`SERVER RODANDO NA PORTA ${PORT}`) })


module.exports =  {app , server}
