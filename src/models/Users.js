const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

//esquema para agregar a la bbdd los datos del formulario   [Esto es un modelo de datos]
const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}, //contrasenia en el modelo de datos
    date: {type: Date, default: Date.now}
});

//m'etodo para cifrar contrasenia
UserSchema.methods.encryptPassword =async(password)=>{
    const salt = await bcrypt.genSalt(10); //genera un hash y lo guardo en "salt"
    const hash = bcrypt.hash(password, salt);//le doy el hash a la contrasenia (esto crear'a la contrasenia cifrada)
    return hash; //retorno la contrasenia cifrada
};

//m'etodo para comparar contrasenia(para que no se compare una contrasenia normal con la cifrada)
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password); //la "password" es la contrasenia que el usuario me est'a danto mientras que "this.password" es la contrasenia que tengo en el modelo de datos
}


module.exports = mongoose.model('User', UserSchema); //lo exportamos con el nombre "User" para usarlo