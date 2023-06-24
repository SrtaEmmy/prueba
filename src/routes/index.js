//aqu'i van las url de la p'agina principal

const router = require('express').Router(); //esta variable nos permite crear rutas

//entrar a la carpeta "models" y tener acceso al archivo "Notes.js" para guardar los datos
const Note = require('../models/Note');
//requerir el confirmador de cerrar sesi'on
const {isAuthenticated} = require('../helpers/auth'); //esto lo que hace es que si detecta que hay una sesi'on iniciada(usuario ha puesto su correo y contrasenia) entonces le permite entrar a todas las rutas, en caso de NO haber sesi'on, no podr'a entrar a cualquiera y si lo intenta le redireccionar'a a la p'agina de login
//ahora todas las rutas que querramos proteger, ponemos este m'etodo antes de la funci'on


router.get('/', (req, res) => {
    res.render('index', {layout: 'layouts/main'}) //le digo que renderice este archivo pero en base al archivo main que est'a en la carpeta "layouts", es nuestra plantilla
});

//ruta (sobre nosotros)
router.get('/about', (req, res) =>{
    res.render('about', {layout: "layouts/main"});
});

//ruta de aniadir nuevas notas
router.get('/notes/add',  (req, res) =>{ //antes de iniciar la funci'on ponemos el "isAuthenticated" para proteger la ruta
    res.render('new-note', {layout: "layouts/main"});
})

//"async" le dice que habr'an procesos as'incronos
//ruta para recibir la info del formulario a la ruta notes/new-notes
router.post('/notes/new-note', async(req, res) =>{//al recibirlos vamos a manejar una funcion por eso ponemos ", (req, res)..."
    // console.log(req.body);//aqui recibo los datos
    // res.send('ok'); //aqui es la accion que quiero que realice tras recibir los datos, le digo que me muestre en pantalla "ok"

const { title, description } = req.body; //le pedimos que guarde los datos del formulario
const errors = [];
if (!title) {
    errors.push({text: 'Please type a Title, bitch'});
}
 if(!description){
    errors.push({text: 'Please, write a description, Bitch!'});
}
if(errors.length>0){
    res.render('new-note', {layout: "layouts/main",
        errors,
        title,
        description
    });
}else{
    // res.send('datos guardados')//si todo ha ido bien(datos guardados correctamente), se muestra esto en pantalla
//almacenarlo en la bbdd
const newNote = new Note({ title, description });
// console.log(newNote); //mostrar en consola (del IDE) los datos recibidos del formulario
await newNote.save(); //para guardarlo en la bbdd usamos este m'etodo "save"
//await y "async" aniadido en el "post", le dice que este proceso de guardar los datos tomar'a un tiempo y que al terminar esto, se ponga a hacer otra cosa(para que el servidor no est'e parado)
req.flash('success_msg', 'Nota añadida correctamente');//aqu'i le mandamos un mensaje a esta vista mediante el m'odulo "flash"

// res.send('ok')
res.redirect('/notes')
}
});

//ruta encargada de consultar los datos de la bbdd(mostrarlos)
router.get('/notes/', async(req, res)=>{
    // res.send('Notes from database');//confirmar que to est'a ien, ahora vamos a consultar los datos 
//consultar
const notes = await Note.find().sort({date:  'desc'});//le decimos que nos devuelva todos los datos de la bbdd y lo guardamos en la varible "notes"
//creamos una nueva vista para mostrar las notas
res.render('all-notes', { layout: "layouts/main", notes }); //le pasamos los datos de las notas para que lo renderice "la variable notes"

});

//ruta para actualizar las notas (esto se ver'a en edit-note.hbs)
router.get('/edit/:id',  async(req, res)=>{
    const note = await Note.findById(req.params.id); //obtenemos el objeto de la base de datos(lo buscamos por id)
    res.render('edit-note.hbs', {layout: "layouts/main", note })
});

//ruta a la que ir'a al pulsar el bot'on "save" tras editar la nota
router.put('/edit-note/:id', async(req, res)=>{
    const {title, description} = req.body; //obtenemos el titulo y la descripci'on del formulario (formulario de editar donde el usuario ha pulsado el bot'on "save")
    await Note.findByIdAndUpdate(req.params.id, {title, description}); //el m'etodo findByIdAndUpdate, recibe dos par'ametros(el id, los datos que quiero actualizar)
    res.redirect('/notes'); //una vez actualizado quiero que me redireccione a la ruta donde est'an todas las notas
});

//ruta para eliminar nota
router.delete('/delete/:id',  async(req, res) => {
    // console.log(req.params.id); //confirmar que estoy recibiendo el id
    // res.send('ok')//mostrar una pagina con "ok" en caso de que todo haya ido bien

//ahora que ya s'e que tengo el id(ya que lo he podido ver en la consola con la linea anterior)
await Note.findByIdAndDelete(req.params.id); //cogemos ese id y lo eliminamos con este m'etodo que como su nombre indica, le pasamos un id como par'ametro y eliminadmos el elemento con ese id
res.redirect('/notes'); //tras la tarea, redirecciname a la p'agina donde est'an todas las tareas(ya est'as en esa p'agina, pero esto es un truco para recargarla y que se vean los cambios que acabamos de realizar en el servidor)
})

module.exports = router; //exportar el ruter para que pueda ser usado por el archivo del servidor index.js 


