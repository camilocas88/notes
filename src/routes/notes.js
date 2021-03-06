const router = require('express').Router()

const Note = require('../models/Note')  // Se pueden usar la constante Note -> para update,save,delete data
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
  //sacar cada propiedad por separado->estoy obteniendo del req.body el titulo y la descripcion como constantes
    const { title, description } = req.body
    //Validar errors
    const errors = []
    if(!title) {
        errors.push({text: 'Please Write a Title'})
    }
    if(!description) {
        errors.push({text: 'Please Write a Description'})
    }
    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({ title, description})
        newNote.user = req.user.id
        await newNote.save()
        req.flash('success_msg', 'Note added Successfully')
        res.redirect('/notes')        
    }
})
//redireccionamiento despues de salvar la nota
router.get('/notes', isAuthenticated, async (req,res) =>{
//desde la coleccion Note, quiero buscar todos los datos
  const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
  res.render('notes/all-notes', { notes })
})

//Ruta para editar notas Cuando me pida la ruta edit
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => {
  const {title, description } = req.body
  await Note.findByIdAndUpdate(req.params.id, {title, description})
  req.flash('success_msg', " Note Updated Successfully")
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', " Note Deleted Successfully")
  res.redirect('/notes')  
})

module.exports = router
