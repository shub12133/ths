var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check,validationResult} = require('express-validator')
const auth = require('../middleware/index')
const passport = require('passport')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//signup 
//@Path - /users/signup
//HTTP method - POST 
//check for validations using express validator - middleware 
// hash password using bcrypt
//save the user into db 
//create payload 
//create a jwt token using method sign 
//send back the token as response 
router.post('/register', [check('email').isEmail(), check('password').isLength({min:6})] ,async (req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
        return res.status(422).json({errors : errors.array()})
  }
  try{
      const user = new db.USERS(req.body)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(user.password,salt);
      user.password = hash 
      await user.save()
      const payload = {
          usr : {
            id : user._id
          }
      }
      jwt.sign(payload, 'SECRETKEY',{expiresIn:'1h'}, (err,token)=>{
        if(err){
          throw err
        }
        res.json(token)
      })
  }catch(err){
      res.status(500).send("Internal Server Error")
  }
})

//@Path - /users/login
//HTTP - POST 
// check for validations
//generate token 
router.post('/login',[check('email').isEmail(),check('password').isLength({min:6})],async (req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()})
  }
  try {
      const user = await db.USERS.findOne({email : req.body.email})
      if(!user){
        return res.status(400).json({errors : [ {msg : 'Invalid Credentials'}]})
      }
      const isMatch = await bcrypt.compare(req.body.password,user.password)
      if(!isMatch){
        return res.status(400).json({errors: {msg : 'Invalid Password'}})
      }
      const payload = {
        usr : {
            id : user._id
        }
      }
      jwt.sign(payload,"SECRETKEY", {expiresIn: 60} , (err,token)=>{
          if(err){
            throw err
          }
          res.json(token)
      })
  }catch(err){
    res.status(500).send("Server Error")
  }

})

//@Path -'/users/dashboard'
//http method - get 
//protected route 
// by adding the auth middleware 
router.get('/dashboard', auth ,async(req,res)=>{
  console.log("req.user",req.user)
  try{
    const user = await db.USERS.findOne({_id:req.user.id})
    res.json(user)
  }catch(err){
    res.status(500).send("Server Error")
  }
});

router.get('/google', passport.authenticate('google',{
    scope : [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
}))

// redirect url 
router.get('/google/callback', passport.authenticate('google'), (req,res)=>{
  
  const payload = {
    id : req.user._id
    
  }
  jwt.sign(payload,'SECRETKEY' ,{expiresIn: 60}, (err,token)=>{
    res.json(token)
    // res.redirect(`http://localhost:3000/oauth/${token}`)
  })
})

module.exports = router;