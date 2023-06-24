//url del servidor para crear, actualizar o eliminar una nota

const router = require('express').Router(); //esta variable nos permite crear rutas

router.get('notes/add', (req, res) =>{
    res.render('about', {layout: "layouts/main"});
})

router.get('/notes/', (req, res)=>{
    res.send('Notes from database');
})
//todo lo que est'a en este archivo lo he migrado a index.js/routes porque aqu'i no funciona


module.exports = router; //exportar el ruter para que pueda ser usado por el archivo del servidor index.js 
