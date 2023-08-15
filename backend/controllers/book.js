const Book = require('../models/book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));

};

exports.getBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));

};

exports.getBestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    .then(book => {
        res.status(200).json(book);
    })
    .catch(error => res.status(400).json({ error }));
    
}

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(() => res.status(201).json({ message: "Book created" }))
    .catch(error => res.status(400).json({ error }))
  
};

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
    .then(book => {
        if(book.userId != req.auth.userId){
            res.status(403).json({ message: "Unauthorized request" })
        } else {
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Book updated" }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));

};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        if(book.userId != req.auth.userId){
            res.status(403).json({ message: "Unauthorized request" })
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Book deleted" }))
                .catch(error => res.status(400).json({ error }));
            });
        }
    })
    .catch(error => res.status(400).json({ error }));

};

exports.postRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        const newRating = {
            userId: req.auth.userId,
            grade: req.body.rating,
        };
        book.ratings.push(newRating);
        
        let totalRating = 0;
        const numberOfRating = book.ratings.length;
        for(let i = 0; i < numberOfRating; i++){
            totalRating += book.ratings[i].grade;
        }
        const averageRating = totalRating / numberOfRating;
        book.averageRating = averageRating;
        book.save()
        .then(() => {
            res.status(200).json(book)
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};