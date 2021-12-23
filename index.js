const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");
const { Sequelize,DataTypes,Model,Op } = require('sequelize');
const session = require('express-session');
const db = require('./controllers/connect')
const User = require('./models/user')
const Film = require('./models/movies')
const Actor = require('./models/actors')
var newData = require('./controllers/dataParse')
app = express();
let isMade = false
db();
let name = ''
const port = process.env.PORT ?? 8050

const rawBodySaver =  (req, res, buf, encoding) =>{
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }

app.set('json spaces', 2);
//app.use(express.json())
app.use(session({ secret: 'secret' }))
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true })); 
const options = {
    verify: rawBodySaver
  };

app.use(bodyParser.json(options));
let semail =''
let spassword =''

app.get("/",(req,res)=>{

    res.send(newData)
})

app.post('/api/v1/users',async(req,res)=>{
   const {email,name,password,confirmPassword} = JSON.parse(req.rawBody)
    try{
    const newUser = await User.create({ email: email ,name:name,password:password,confirmPassword:confirmPassword});
   // req.sessionID = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjI0OTYwMTQwfQ.Yh91vOoWAQrcQMGGgGxA8kdWcn3JAq_BoIG8DF9DTnQ'
    req.session.email = newUser.email;
    req.session.password = newUser.password;
    //console.log(newUser)
    res.json({token:req.sessionID,status:'1'})
    }
    catch(e){
        console.log(e.errors)
        res.json(e.errors)
    }
})
app.post('/api/v1/sessions',async(req,res)=>{
    const {email,password} = JSON.parse(req.rawBody)
    //console.log(req.rawBody)
    //console.log(req.session.password)
   // console.log(req.session.email)
    if(req.session.password==password && req.session.email==email ){
        res.json({token:req.sessionID,status:'1'})
    }
    else{
        res.json({
            "status": 0,
            "error": {
              "fields": {
                "email": "AUTHENTICATION_FAILED",
                "password": "AUTHENTICATION_FAILED"
              },
              "code": "AUTHENTICATION_FAILED"
            }
          })
    }
   
   

})
app.post('/api/v1/movies',async(req,res)=>{
    try{
    const {title,year,format,actors} = JSON.parse(req.rawBody)
    //console.log(JSON.parse(req.rawBody))
    var objects = [];
    console.log(JSON.stringify(req.headers));

        for(let actor of actors){
            const newActor = await Actor.create({name:actor})
            objects.push(newActor)
        }
        const findActors = await Actor.findAll();
        const newFilm = await Film.create({title: title ,year:year,format:format})
        for(let object of objects){
            newFilm.addActor(object)
        }
        const findFilm = await Film.findOne({where:{title:title},include: [ Actor ] });
        console.log(findActors)
        console.log(findFilm)
        res.json(findFilm)
        
       
        }
        catch(e){
            console.log(e.errors)
            res.json(e.errors)
        }
   
});
app.delete('/api/v1/movies/:id',async(req,res)=>{
    const id = req.params.id;
  
        const deleted= await Film.destroy({ where: { id: id}});
        if(deleted==1){
            res.json({status:deleted})
          }
else{
        res.json({
            "status": 0,
            "error": {
              "fields": {
                "id": id
              },
              "code": "MOVIE_NOT_FOUND"
            }
          })
        }
   
    
})
app.patch('/api/v1/movies/:id',async(req,res)=>{

    const id = req.params.id;
    const {title,year,format,actors} = JSON.parse(req.rawBody)
    var objects = []
    try{
        for(let actor of actors){
            const newActor = await Actor.create({name:actor})
            objects.push(newActor)
        }
        const findFilm = await Film.findOne({where:{id:id},include: [ Actor ] });
        await findFilm.destroy();
        const newFilm = await Film.create({id:id,title: title ,year:year,format:format})
/*
       const updated = await Film.update({ title: title ,year:year,format:format}, {
            where: {
              id: id
            }
          });*/
          for(let object of objects){
            newFilm.addActor(object)
        }
        await newFilm.save();
        const found = await Film.findOne({where:{title:title},include: [ Actor ] });

       // console.log(newFilm)
        //console.log(objects)
        console.log(found)
        res.json(found)
        }
        catch(e){
            console.log(e.errors)
            res.json(e.errors)
        }
})


app.get('/api/v1/movies/:id',async(req,res)=>{
    const id = req.params.id
    const foundMovie = await Film.findOne({where:{id:id},include: [ Actor ] });
    //console.log("Actors parse OKKKKKK : "+foundMovie)
    res.json(foundMovie)
    //res.render('foundMovie',{foundMovie});
})
app.get('/api/v1/movies',async(req,res)=>{
    let {actor,title,search,sort,order,limit,offset} = req.query
    if(title || search){
        const foundMovie = await Film.findAll({where:{
            [Op.or]: [{ title:{[Op.like]:  ' '+search+'%'} }, { title:{[Op.like]:  ' '+title+'%'} }] 
           } ,include: [ Actor ] });
           res.json(foundMovie)
           
    }
    else{
    limit = limit ?? '20'
    offset = offset ?? '0'
    sort = sort ?? 'id'
    order = order ?? 'ASC'
    console.log(req.query)
    
    const foundMovie = await Film.findAll({
       limit:limit,
       offset:offset,
       order: [[sort]],
       [Op.or]:[{order: [[sort]]},{order: [[Film.title,order]]}],
       include: [ Actor ] });
    //const movies = await Film.findAll({ order: [['title']]});   [Op.or]:[{order: [[sort]]},{order: [[title,order]]}],
    
    console.log(foundMovie)
    res.json(foundMovie)
    }
    //res.render('foundMovie',{foundMovie}); { [Op.or]: [{ order: order }, { order: sort }]}
})
app.post('/api/v1/movies/import',async(req,res)=>{
    try{
    for(let text of newData){
         const newMovie = await Film.create({title:text.title,year:text.year,format:text.format});
     }
     const movies = await Film.findAll();
    res.json(movies)
    }
    catch(e){
    res.json(e.errors)
    }
    //res.render('foundMovie',{foundMovie});
})

app.listen(port,()=>{
    console.log('Server is running')
})