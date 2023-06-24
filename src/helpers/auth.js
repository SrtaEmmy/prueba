const helpers = {};

//esto nos lo permie hacer password gracias a su m'etodo "isAuthenticated"
helpers.isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){ //si detecta una sesi'on iniciada
        return next();//entonces pasar'a a las siguientes funciones
    }
    req.flash('error_msg', 'Not autorized');//en caso contrario mostrar'a un error
    res.redirect('/users/signin');//y ser'a redireccionado a la p'agina para iniciar una sesi'on
}

module.exports = helpers; //exportarlo para usarlo en index.js(rutas)