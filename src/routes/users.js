const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')


//auth signin
router.get('/users/signin', (req, res) =>{
  res.render('users/signin')
})

//utilizar el metodo post
router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}))



//callback route for google to redirect to
// router.get('/users/signin/google/redirect', passport.authenticate('google'), (req, res) => {
//   res.send('you reached the callback UTL')
// })

router.get('/users/signup',(req, res) =>{
    res.render('users/signup')
})

//auth with google
// router.get('/users/logout', (req,res) => {
//   //handle with passport
//   res.send('logging Out')
// })

router.post('/users/signup', async (req,res) => {
  const { name, email, password, confirm_password} = req.body
  const errors = [];

  if(name.length <= 0) {
    errors.push({text: 'Please insert your Name'})
  }
  if(email.length <= 0) {
    errors.push({text: 'Please Insert Email'})
  }
  if(password.length <= 0) {
    errors.push({text: 'Please Insert pass'})
  }
  if(confirm_password.length <= 0) {
    errors.push({text: 'Please Insert Confirm pass'})
  }
  if (password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'})
  }
  if(password != confirm_password) {
      errors.push({text: 'the passwords not match'})
  }
  if(errors.length > 0) {
    res.render('users/signup', {errors, name, email, password, confirm_password})
  }else {
    const emailUser = await User.findOne({email: email})
    if (emailUser) {
    req.flash('error_msg', 'The Email is already in use')
    res.redirect('/users/signup')
    }
    const newUser =  new User({name, email, password})
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save()
    req.flash('success_msg', 'You are Registered')
    res.redirect('/users/signin')
  }  
})

router.get('/users/logout', (req,res) =>{
  req.logOut()
  res.redirect('/')
})

module.exports = router
