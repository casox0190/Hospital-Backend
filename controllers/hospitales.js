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
    const id=req.params.id;

        
    try {

    const hospitalDB=await Hospital.findById(id);

 //Comprobar si existe un hospital para ese id
    if(!hospitalDB){
        return res.status(404).json({
            ok:false,
            msg:'No existe un hospital con ese id'
        });
    }

   const cambiosHospital={
    ...req.body,
    usuario:uid
   }

       
    const hospitalActualizado=await Hospital.findByIdAndUpdate(id,cambiosHospital,{new:true});

        res.json({
            ok:true,
            hospital:hospitalActualizado,
           
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

    const id=req.params.id;
    
    try {

    const hospitalDB=await Hospital.findById(id);

    if(!hospitalDB){
        return res.status(404).json({
            ok:false,
            msg:'No existe un hospital con ese id'
        });
    }
       
    await Hospital.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:'Usuario eliminado',
            
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