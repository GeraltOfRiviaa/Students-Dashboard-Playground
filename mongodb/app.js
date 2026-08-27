const express = require('express');
const { connect_to_db, get_db} = require('../mongodb/db');
const { ObjectId } = require('mongodb');
// init app & middleware
const app = express();
app.use(express.json())
// db connection
let db

connect_to_db((err) => {
    if (!err){
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        db = get_db()
    }
    else{
        console.log('connect_to_db err');
    }
    
})

// routes
app.get('/books', (req, res) => {
    const page = req.query.pages || 0
    const books_per_page = 3

    let books = []
    
    db.collection('books')
        .find() //cursor toArray forEach
        .sort({author: 1})
        .skip(page * books_per_page)
        .limit(books_per_page)
        .forEach(book => books.push(book))
        .then(() =>  {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
});

app.get('/books/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch document'})
        })
    }
    
    else{
        res.status(500).json({error: 'Not a valid document id'})
    }
    
})

app.post('/books', (req, res) => {
    const books = req.body

    db.collection('books')
    .insertMany(books)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not create a new document'})
    })
})

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not delete the document'})
        })
    }
    else{
        res.status(500).json({error: 'Not a valid document id'})
    }
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not update the document'})
        })
    }
    else{
        res.status(500).json({error: 'Not a valid document id'})
    }
})