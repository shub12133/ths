const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/jwtcb2020', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("DB is connected"))
.catch((err)=> console.log(err))

const USERS = require('./users')

module.exports = {
    USERS
}