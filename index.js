require('dotenv').config();
const express=require('express');
const {dbConnection}=require('./database/config');
const cors=require('cors');


//Crear el servidor de Express
const app=express();

//Establecer conexión entre Mongo y el Backend
dbConnection();

//Configurar cors
app.use(cors());

//Levantar el servidor de Express
app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en puerto '+process.env.PORT);
});

//Rutas
app.get('/',(req,res)=>{res.json({ok:true,msg:'Hola mundo'})});



