const express=require('express');
require ('dotenv').config();
const {dbConnection}=require('./database/config');
const cors=require('cors');



//Crear el servidor de express
const app=express();

//Configurar Cors
app.use(cors());

//Carpeta publica
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos',require('./routes/medicos'));
app.use('/api/login',require('./routes/auth'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/upload',require('./routes/uploads'));

//Levantar el servidor
app.listen(process.env,()=>{
    console.log('servidor corriendo en el puerto '+process.env.port)
});