'use strict';
require('dotenv').config();
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
    res.render('pages/index');
});
app.get('/searches/new', (req, res) => {
    res.render('pages/searches/new');

});

// app.get('/location', searchesHandler);
app.get('/searches', searchesHandler);
app.get('/', homeHandler);
app.get('/books/:book_id', getOneBook);
app.post('/books', booksHandler);

function booksHandler(req, res) {
    let {title,author, shelf, description, img_url,isbn} = req.body;
    let SQL = `INSERT INTO books (title,author, shelf, description, img_url,isbn) VALUES ($1,$2,$3,$4,$5,$6);`;
    let safeValues = [title,author, shelf, description, img_url,isbn];
    client.query(SQL,safeValues)
    .then(()=>{
      res.redirect('/');
    })
}

function getOneBook(req, res) {
    let SQL = `SELECT * FROM books WHERE id=$1;`;
    let book = [req.params.book_id];
    // console.log(req.params);
    client.query(SQL, book)
        .then(results => {
            res.render('pages/books/show', { bookDetails: results.rows[0] });
        });
}
function homeHandler(req, res) {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL)
        .then(results => {
            res.render('pages/index', { books: results.rows });
        })
    // .catch(error=>errorHandler(error));
}

function searchesHandler(req, res) {
    let searchText = req.query.searchText;
    let searchBy = req.query.searchBy;
    let url = `https://www.googleapis.com/books/v1/volumes?q=`;
    if (searchBy === 'title') {
        url += `${searchText}`;
    } else {
        url += `inauthor:${searchBy}`;
    }
    superagent.get(url)
        .then(booksData => {
            return booksData.body.items;
        })
        .then(booksItems => {
            let booksArray=[];
            for (let index = 0; index < 10; index++) {
                booksArray.push(new Book(booksItems[index]));
            }
            return booksArray;
        })
        .then(booksArray => {
            res.render('pages/searches/show', { books: booksArray });
        });
}

app.get('/searches/show', (req, res) => {
});


// res.redirect('/welcome.html');


function Book(data) {
    this.title = data.volumeInfo.title || 'Unknown Title';
    this.author = data.volumeInfo.authors[0] || 'Unknown Author';
    this.description = data.volumeInfo.description || 'No Description';
    this.img_url = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
    this.isbn = data.volumeInfo.industryIdentifiers[0].identifier || 'No ISBN'
}

app.get('*', (req, res) => {
    res.status(404).send(`This route doesn't exist`);
})
function errorHandler(error, request, response) {
    response.status(500).send(error);
}
client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on PORT ${PORT}`)
        );
    });