//url donde los usuarios pueden autenticarse
const router = require('express').Router(); //esta variable nos permite crear rutas

//instanciar el m'odulo del usuario(lo que hemos hecho para que se guarde en la bbdd, encryptar contrasenia, Schema etc)
const User = require('../models/Users'); //ahora "User" es un modelo de datos que puedo usar para guardar un dato nuevo

const passport = require('passport');//requerimos el passport para autenticar el usuario

//ruta para registrarse
router.get('/users/signin', (req, res)=>{
    res.render('users/signin', {layout: 'layouts/main'})
})

//autenticar el usuario (para esto debemos importar "passport")
router.post('/users/signin', passport.authenticate('local', {//le decimos que la forma de autenticaci'on es "local" ya que es la que hemos establecido en passport.js
    successRedirect: 'notes', //en caso de que la autenticaci'on sea correcta(contrasenia y correo bien) entonces le redireccionamos a la p'agina de notas(que es donde est'a intentando entrar)
    failureRedirect: '/users/signin', //en caso de que autenticaci'on falle, le redireccionamos a la propia p'agina actual
    failureFlash: true

})); 

//ruta para el login
router.get('/users/signup', (req, res)=>{
    res.render('users/signup', {layout: 'layouts/main'})
});

//ruta a la que el formulario va a enviar los datos
router.post('/users/signup', async(req, res)=>{ //aunque las rutas sean iguales, al estar enviandolas por distintos m'etodos, no afectar'a en su funcionamiento
    // console.log(req.body); //mostrar por consola los datos recibidos
    // res.send('oki') //mostrar "oki" si todo va bien
    const { name, email, password, confirm_password } = req.body; //guardamos en una variableObjeto esos datos(usamos el "name" puesto en cada input del formulario)
    const errors = [];

    if (name.length <=0) {
        errors.push({text: 'Inserta tu nombre puta'})

    }
    const emailInUse = await User.findOne({email: email}); //le decimos que busque en la bbdd un email que sea igual al email que nos est'a pasando el usuairo en el formulario y lo guarde en la variable "emailInUse"
    if (emailInUse) {//en caso de que la variable sea true, exista, quiere decir que ha encontrado el email del formulario en la bbdd, por lo tanto ese email ya est'a en uso
        errors.push({text: 'El correo introducido ya está en uso ja ja'})
        // res.redirect('/users/signup')
        // return; //esto es para que el c'odigo deje de ejecutarse aqu'i y no siga enviando m'as respuestas al cliente, ya que si ha mostrado este error enpantalla, no debe continuar el procedimiento de almacenar datos en la bbdd
    }
    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'}) //aniadimos este error al arreglo de errores(en caso de que se cumpla esta condici'on)
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe tener al menos 8 carácteres'})
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password, layout: 'layouts/main'}); //renderizamos la vista pero con los errores y los datos para que no los tenga que volver a insertar
    }else{
        // res.send('Ok')



        //creo un objeto (un  usuario)
        const newUser = new User({name, email, password}); //voy a usar el modelo de datos para crear un nuevo usuario ¿con qué datos? con los que recibo del formulario
        //de ese objeto, su propiedad "password" la vamos a encriptar
        newUser.password = await newUser.encryptPassword(password)
        //guardar en la bbdd al usuario creado
        await newUser.save();
        res.redirect('/users/signin');
    }


});

//ruta para cerrar sesi'on
router.get('/users/logout', (req, res)=>{
    req.logout(); //esto es un m'etodo de "password" que lo que hace es terminar con la sesi'on iniciada por el usuario
    res.redirect('/'); //le decimos que nos redireccione a la p'agina principal
})

//ruta que no existe y que el navegador me muestra un error de que no existe
router.get('/users/notes', (req, res) => {
    // Aquí puedes agregar el código para manejar la solicitud a esta ruta
    res.render('all-notes', {layout: '/layouts/main'});
  });
  

module.exports = router; //exportar el ruter para que pueda ser usado por el archivo del servidor index.js 

