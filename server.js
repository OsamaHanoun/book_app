'use strict';
require('dotenv').config();

const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get('/hello',(req,res)=>{
    res.render('pages/index');
});
app.get('/searches/new',(req,res)=>{
    res.render('pages/searches/new');
});
app.get('/form',(req,res)=>{
    console.log(req);
    res.send(req.query);
});

    // res.redirect('/welcome.html');

app.get('*',(req,res)=>{
    res.status(404).send(`This route doesn't exist`);
})

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})