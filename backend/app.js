var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// import subject schema

const Subject = require('./schemas/subjectSchema');


// connect to mongodb cluster databse with mongoose

const  mongoAtlasUri ="mongodb+srv://19lob4:test1234@cardify.onbct.mongodb.net/subjects?retryWrites=true&w=majority";

mongoose
    .connect(mongoAtlasUri,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: 'Cardify' })
    .then(()=>{
        console.log("Mongoose - Sucess!")
        // the following lines make up the CRUD api...

        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true}));
        app.use(cors());

        app.get('/subjects', async(req,res)=>{

            //- res.send('Cardify Api')

            try{
                var subjects = await Subject.find().exec();
                res.send(subjects);
            } catch(err){
                res.status(500).send(err);
            }

        });

        //edits to content
        app.put("/subjects/:id", async(req,res)=>{
            try{
                var subject = await Subject.findByIdAndUpdate({_id:req.params.id},req.body).exec();
                // subject.set(req.body)            
                res.send(subject)
            } catch(err) {
                res.status(500).send(err)
            }
        })

        //add a new subject...
        app.post("/subjects",async(req,res)=>{
            try{
                var newSubject = new Subject(req.body)
                var result = await newSubject.save();
                res.send(result)
            }
            catch(err){
                res.status(501).send(err)
            }
        })

        //delete a subject
        app.delete("/subjects/:id",async(req,res)=>{
            try{
                var result = await Subject.deleteOne({_id: req.params.id}).exec();
                res.send(result);
            } catch(err) {
                res.status(500).send(err)
            }
        })










        // start server on port 3001
        app.listen(3001,()=>console.log('Active on port 3001'));

    })
    .catch(e => console.log('mongo failed to connect'));



