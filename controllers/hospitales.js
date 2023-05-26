const Hospital=require('../models/hospital');
const {response}=require('express');


const getHospitales=async(req,res)=>{
    
    const hospitales=await Hospital.find()
                                    .populate('usuario','nombre img');
                                    

    res.json({
        ok:true,
        hospitales,
      
    });
}

const crearHospital=async(req,res=response)=>{

    //Guardar el id que ya viene almacenado en el token introducido en el header
    const uid=req.uid;

    const hospital=new Hospital({
        usuario:uid,
        ...req.body
    }); 

    try {
            const {nombre}=req.body;
            const existeHospital=await Hospital.findOne({nombre});

            if(existeHospital){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un hospital con ese nombre'
                });
            }
            
            const hospitalDB= await hospital.save();
         
            
        res.json({
             ok:true,
             hospital:hospitalDB

            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Error inesperado... revisar logs'
            });
        }

}

const actualizarHospital=async(req,res=response)=>{

        
    try {

    const hospitalDB=await Hospital.findById(id);

 //Comprobar si existe un hospital para ese id
    if(!hospitalDB){
        return res.status(404).json({
            ok:false,
            msg:'No existe un hospital con ese id'
        });
    }

     //Actualizaciones
    const {nombre, ...campos}=req.body;

    //Comprobar si el email introducido en el 'req.body' es diferente del que ya existe para el usuario con ese id
    if(hospitalDB.nombre!==nombre){

        //Comprobar si el nombre de ese hospital no existe para otro
        const checkHospitalDuplicate=Hospital.findOne({nombre});
        if(checkHospitalDuplicate){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe un hospital con ese nombre'
            });
        }
    }
    campos.nombre=nombre;
   
   
    const hospitalActualizado=await Hospital.findByIdAndUpdate(id,campos,{new:true});

        res.json({
            ok:true,
            hospital:hospitalActualizado,
            id:req.id
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Erorr inesperado'
        });
    }

}

const eliminarHospital=async(req,res=response)=>{

    const uid=req.params.id;
    
    try {

    const usuarioDB=await Usuario.findById(uid);

    if(!usuarioDB){
        return res.status(404).json({
            ok:false,
            msg:'No existe un usuario con ese id'
        });
    }
       
    await Usuario.findByIdAndDelete(uid);

        res.json({
            ok:true,
            msg:'Usuario eliminado',
            uid:req.uid
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Erorr inesperado'
        });
    }

}


module.exports={
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}