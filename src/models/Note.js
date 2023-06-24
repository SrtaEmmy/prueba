const  mongoose = require('mongoose'); //requerir mongoose para crear esquemas de datos
const {Schema} = mongoose; //por eso aqui requerimos solo el esquema(de todo lo que hay en el m'odulo)

//lo guardo todo en una constante para poder usarlos
const NoteSchema = new Schema({ //crear mi esquema (mis notas, los datos de mi nota, qu'e propiedades van a tener mis notas) que tendr'a 
    title: {type: String, required: true}, //tendr'a un t'itulo, de tipo string, y que ser'a obligatorio(por eso required true, para que no est'e vac'io)
    description: {type: String, required: true},
    date: {type: Date, default: Date.now} //otra propiedad es la fecha, de tipo fecha, y para que cree una fecha autom'atica de ahora para ello le ponemos "default"
});

//lo expotamos para que pueda ser usado en otras partes de la app
module.exports = mongoose.model('Note', NoteSchema); //model es una de las 'cosas' de mongoose, que recibe dos par'ametros(nombre, esquema) ["esquema" es lo guardado en la variable NoteSchema]