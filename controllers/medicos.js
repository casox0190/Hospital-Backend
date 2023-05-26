const medico = require('../models/medico');
const Medico=require('../models/medico');
const {response}=require('express');


const getMedicos=async(req,res)=>{
    
    const medicos=await Medico.find()
                    .populate('usuario','nombre img')
                    .populate('hospital','nombre');

    res.json({
        ok:true,
        medicos  
    });
}

const crearMedico=async(req,res=response)=>{

    const uid=req.uid;
    const hospitalDB=req.body.hospital;

    const medico=await new Medico({
        usuario:uid,
        ...req.body
    });
    
     try {
        const {nombre}=req.body;
        const existeMedico=await Medico.findOne({nombre});

        if(existeMedico){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe un medico con ese nombre'
            });
        }

        //Guardar medico
        const medicoDB=await medico.save();
         
         
            
        res.json({
             ok:true,
             medico:medicoDB

            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Error inesperado... revisar logs'
            });
        }

}

const actualizarMedico=async(req,res=response)=>{

const id=req.params.id;
const uid=req.uid;
       
    try {
    const medico=await Medico.findById(id);

    if(!medico){
        return res.status(404).json({
            ok:false,
            msg:'No existe un medico con ese id'
        });
    }

     //Actualizaciones
    const cambiosMedico={
        usuario:uid, 
        ...req.body
    }

     
   
    const medicoActualizado=await Usuario.findByIdAndUpdate(uid,cambiosMedico,{new:true});

        res.json({
            ok:true,
            medico:medicoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Erorr inesperado'
        });
    }

}

const eliminarMedico=async(req,res=response)=>{

const id=req.params.id;
const uid=req.uid;
       
    try {
    const medico=await Medico.findById(id);

    if(!medico){
        return res.status(404).json({
            ok:false,
            msg:'No existe un medico con ese id'
        });
    }
        
   
   await Medico.findByIdDelete(id);

        res.json({
            ok:true,
            msg:'Medico borrado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}