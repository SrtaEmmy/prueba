const express = require('express');
const path = require("path");
const exphbs = require('express-handlebars'); //motor de plantilla que permite crear las partes fijas del html(crear plantilla y modificar solo los datos personales)
const methodOverride = require('method-override'); //override permite enviar datos a trav'es de m'as m'etodos diferentes del get y post
const session = require('express-session');
const flash = require('connect-flash');//esto permite enviar mensajes entre m'ultiples vistas
const passport = require('passport');//(*)


//initializations, preparando la bbdd
const app = express();
require('./database');
require('./config/passport');//(*)    requerimos todo eso que hemos hecho en passport.js


//settings (configuacion)
app.set('port', process.env.PORT || 3000); //creo una configuraci'on de puerto para la nube o el local 3000
app.set('views', path.join(__dirname, "views")); //metodo path permite unir directorio, dirname me devuelve la ruta hasta mi carpeta global(src) as'i que la concateno con otra que tiene dentro, en este caso "views", basicamente esta l'inea sirve para decirl al servidor que la carpeta "views" est'a justo aqu'i

//otra forma de hacerlo ya que la de arriba no me funciona ostias
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
});

app.set('view engine', '.hbs'); //esta linea sirve para usar la configuraic'ion que hemos hecho, configura el motor de las vistas(plantilla), y el motor en este proyecto es hbs


//middlewares
app.use(express.urlencoded({extended: false}));  //esta l'inea sirve para que cuando un formulario me envie una informaci'on, yo la reciba. Extend:false es porque no vamos a recibir im'agenes ni nada de eso
app.use(methodOverride('_method')); 
app.use(session({     //a trav'es de estas configuraciones abajo, express nos va a permitir autenticar usuarios y almacenar datos
	secret: 'mysecretapp',  //palabra secreta que solo t'u sabes
	resave: true,
	saveUninitialized: true
}));

app.use(flash());//ahora podemos usar el flash para enviar mensajes entre las vistas
app.use(passport.initialize());//(*)


//global variables
app.use((req, res, next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
})



//routes (aqu'i le decimos que use los archivos que tenemos en la carpeta "routes", ya que crear'a una ruta para cada uno de ellos)
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//static files
app.use(express.static(path.join(__dirname, 'public'))); //esto es para decirle a nuestro servidor que la carpeta public est'a aqu'i (esta carpeta contiene todo el contenido html)



//server is listening
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});

