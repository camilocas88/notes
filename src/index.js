const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
// const passportSetup = require('./config/passport')
const passport = require('passport')


//Initializations
const app =express()
require('./database')
require('./config/passport')


//-------------------setings-----------------
app.set('port', process.env.PORT || 8080)
//decirle a node que la carpeta iews esta en src
app.set('views', path.join(__dirname, 'views'))
//configurar HANDLEBARS
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir:path.join(app.get('views'), 'layouts'),
  partialsDir:path.join(app.get('views'), 'partials'),
  extname:'.hbs'
}))
//Utilizar HANDLEBARS 
app.set('view engine','.hbs')



//--------------------midelwares-----------------
//urlencoded= Recibir los datos de los usuarios, ->extended false es para no adminir img
app.use(express.urlencoded({extended: false}))
//override-> sirve para que los usuarios puedan enviar otros metodos como PUT y DELETE
app.use(methodOverride('_method'))
//modulo de session->Guardar los datos de los usr atravez de una secion
app.use(session({
    secret: 'Tenshi22',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())



//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

//Routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))


// Static Files
//la carpeta public
app.use(express.static(path.join(__dirname, 'public')))


//server is listening
app.listen(app.get('port'), () => {
    console.log('Server on Port:', app.get('port'));
    
})