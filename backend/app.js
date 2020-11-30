var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// import subject schema

const Subject = require('./schemas/subjectSchema');


// connect to mongodb cluster databse with mongoose

const  mongoAtlasUri ="mongodb+srv://19lob4:test1234@cardify.onbct.mongodb.net/subjects?retryWrites=true&w=majority";

try {
     mongoose
     .connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Mongoose - Sucess!")
    )
    
    .then(()=>{
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














        // start server on port 3000
        app.listen(3000,()=>console.log('Active on port 3000'));

    });


}catch (e) {
    console.log("Mongoose - Could not connect");
}


