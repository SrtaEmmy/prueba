const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //esta estrategia de autenticaci'on es la loca, tambi'en hay para google, github, twitter etc

const User = require('../models/Users');

//autenticar usuario(ver si se puede loguear correctamente)
passport.use(new LocalStrategy({//aqu'i vamos a recibir los datos que nos va a mandar el usuario para loguearse
    usernameField: 'email'}, //el dato que necesito para saber si un usuairo est'a registrado es el "email"
    async(email, password, done) => { //a continuaci'on ejecutamos una funci'on, la que recibir'a los datos y un callback(done) para terminar con la autenticaci'on
    //dentro de esta funci'on nos metemos en la bbdd a verificar si existen los datos que nos pide el formulario de login(para eso importamos el modelo de datos en models/Users)
        const user = await User.findOne({email: email}); //sentencia para buscar el correo que me ha pasado el usuario en la bbdd, esto puede devolverme un usuario o no
    if (!user) {//a continuaci'on le digo, que si no existe el usuario(no me ha devuelto ninguno porque no se encuentra en la bbdd)
        return done(null, false, {message: 'Correo electrónico incorrecto'}); //entonces ejecuto el callBack que sirve para finalizar el proceso de autenicaci'on
                    //en el callBack enviamos 3 par'ametros(null para indicar que no ha habido ning'un error, false porque no existe el usuario, mensaje a msotrar)
    }else{//en caso se SÍ encontrar el usuario del correo en la bbdd, procedemos a validar su contrasenia
        const match = await user.matchPassword(password); //el m'etodo matchPassword lo hemos creado en el modelo de datos y recib'ia una contrasenia y me retorna true o false si existe la contrasenia o no
        if (match) {
            return done(null, user);//enviamos null porque no hay ning'un error, se da por hecho que el valor del medio ha devuelto "true" y por 'ultimo devolvemos el usuario(encontrado en la bbdd)
        }else{//si la contrasenia es incorrecta
            return done(null, false, {message: 'Contraseña incorrecta'}); //no hay ning'un error, no se encuentra el usuario en la bbdd, mensaje
        }
    }
}
));


passport.serializeUser((user, done)=>{//toma un usuario y un callback
    done(null, user.id);//error nulo porque no hay, y se va a almacenar en una sesi'on el id para no tener que estar pidiendo que repita el login en cada p'agina que vaya(porque ya se ha logueado una vez)
});

//esto hace el proceso contrario al anterior
passport.deserializeUser((id, done)=>{//toma un id y un callback
    User.findById(id, (err, user)=>{ //busca en la bbdd el usuario con el id y en la b'usqueda puedo tener dos resultados(un error, o el usuario)
        done(err, user);//en el callback decimos que si hay alg'un error que lo devuelva y si hay alg'un usuario tambi'en
    });
});

//para que todo esto funcione es necesario realizar algunas configuracione en Index.js  //(*)