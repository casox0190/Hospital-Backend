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

        
    try {

    const medicoDB=await Medico.findById(id);

    if(!medicoDB){
        return res.status(404).json({
            ok:false,
            msg:'No existe un medico con ese id'
        });
    }

     //Actualizaciones
    const {password, google, email, ...campos}=req.body;

    //Comprobar si el email introducido en el 'req.body' es diferente del que ya existe para el usuario con ese id
    if(usuarioDB.email!==email){

        //Comprobar si el email introducido en el 'req.body'  ya existe para otro usuario
        const checkEmailDuplicate=Usuario.findOne({email});
        if(checkEmailDuplicate){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe un usuario con ese email'
            });
        }
    }
    campos.email=email;
   
   
    const medicoActualizado=await Usuario.findByIdAndUpdate(uid,campos,{new:true});

        res.json({
            ok:true,
            usuario:usuarioActualizado,
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

const eliminarMedico=async(req,res=response)=>{

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
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}