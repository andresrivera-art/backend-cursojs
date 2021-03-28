'use strict'

const project = require('../models/project');
var Project = require('../models/project');
var fs = require('fs');
const { proppatch } = require('../routes/project');
const { exists } = require('../models/project');

var path = require('path');

var controller = {

    home: function(req, res){

        return res.status(200).send({
            message: 'Soy home'
        });
    },
    test: function(req,res){
        return res.status(200).send({
            message: 'test del controlador'
        });
    },
    saveProject: function(req,res){
        var project = new Project();
        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored)=>{

            if(err) return res.status(500).send({message: 'Error al guardar'});

            if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto'});

            return res.status(200).send({project: projectStored});


        });
    },

    getProject: function(req,res){

       var  projectId = req.params.id;

       if(projectId==null) return res.status(404).send({message:'el proyecto no existe'});

       Project.findById(projectId, (err,project)=>{

        if(err) return res.status(500).send({message: 'Error al devolver los datos'});

        if(!project) return res.status(404).send({message:'el proyecto no existe'});

        return res.status(200).send({
            project
        });


       });  
    },
    getProjects: function(request, response){
// -, mayor a menor,
// +, menor a mayor
        project.find({}).sort('-year').exec( (error,projects)=>{

            if(error) return request.status(500).send({message: 'Error al devolver los datos'});

            if(!projects) return request.status(404).send({message: 'No existen proyectos'});

            return response.status(200).send({projects});

        });
    },

updateProject: function(request, response){

    var projectId = request.params.id;
    var update = request.body;

    Project.findByIdAndUpdate(projectId,update, {new:true}, (error,projectUpdated)=>{

        if(error) return request.status(500).send({message: 'Error al actualizar los datos'});

        if(!projectUpdated) return request.status(404).send({message: 'No existe el proyecto'});

        return response.status(200).send({projectUpdated});

    });

},

deleteProject:function(request, response){

    var projectId = request.params.id;
   
    Project.findByIdAndRemove(projectId, (error,projectDeleted)=>{

        if(error) return request.status(500).send({message: 'Error al borrar los datos'});

        if(!projectDeleted) return request.status(404).send({message: 'No existe el proyecto'});

        return response.status(200).send({project: projectDeleted});

    });

},

uploadImage: function(request,response){

var projectId = request.params.id;

var fileName = 'Imagen no subida...';

if(request.files){

   var filePath = request.files.image.path;

    var fileSplit = filePath.split('\\');

    var fileName = fileSplit[1];

    var extSplit = fileName.split('\.');

    var fileExt = extSplit[1];

    if(fileExt == 'png' || fileExt== 'jpg' || fileExt=='jpge' || fileExt=='gif'){

        Project.findByIdAndUpdate(projectId, {image:fileName}, {new:true}, (error,projectUpdated)=>{

            if(error) return response.status(500).send({message: 'La imagen no se ha subido'});
        
            if(!projectUpdated) return responsestatus(404).send({message: 'El proyecto no existe'});
        
            return response.status(200).send({project: projectUpdated});
        
        
            });

    }else{

        fs.unlink(filePath, (error)=>{

return response.status(500).send({ message: 'la extension no es valida'});


        });

    }

    

}else{

    return response.status(200).send({ message: fileName}); 

}



},


getImageFile:function(request, response){

var file =  request.params.image;
var path_file = './uploads/'+file;

fs.stat(path_file, (err, stats)=>{


    if(err){
        return response.status(404).send({message:
            "no existe la imagen"});
    }else{
        return response.sendFile(path.resolve(path_file));
    }

});

}//end 



};


module.exports = controller;
