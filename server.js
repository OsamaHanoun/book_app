'use strict';
require('dotenv').config();

const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
var booksArray =[];

app.get('/hello', (req, res) => {
    res.render('pages/index');
});
app.get('/searches/new', (req, res) => {
    res.render('pages/searches/new');
});
app.get('/searches', (req, res) => {
    let searchText = req.query.searchText;
    let searchBy = req.query.searchBy;
    let url;
    if (searchBy === 'title') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${searchText}`;
    } else {
        url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchBy}`;
    }
    superagent.get(url)
        .then(booksData => {
            return booksData.body.items;
        })
        .then (booksItems =>{
            
            for (let index = 0; index < 10; index++) {
                booksArray.push(new Book(booksItems[index]));
            }
            return booksArray;
        })
        .then (()=>{res.redirect('/searches/show');})
});

app.get('/searches/show', (req, res) => {
    res.render('pages/searches/show',{books:booksArray});
});


// res.redirect('/welcome.html');


function Book(data) {
    this.title = data.volumeInfo.title || 'Unknown Title';
    this.author = data.volumeInfo.authors[0] || 'Unknown Author';
    this.description = data.volumeInfo.description || 'No Description';
    this.img_url = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
}

app.get('*', (req, res) => {
    res.status(404).send(`This route doesn't exist`);
})

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})