const express = require('express');
const router = express.Router();
const fileUploadMulter = require('../middleware/bookFile');

const { v4: uuid } = require('uuid');

class Book {
    constructor(
        id = uuid(), 
        title = "", 
        description = "",
        authors = "",
        favorite = "",
        fileCover = "",
        fileName = "",
        fileBook = ""
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
};

const library = {
    book: [
        {   
            id: uuid(),
            title: "Книга 1",
            description: "Описание книги 1",
            authors: "Автор 1",
            favorite: "Да",
            fileCover: "cover1.jpg",
            fileName: "book1.pdf",
            fileBook: "1"
          },
          {
            id: uuid(),
            title: "Книга 2",
            description: "Описание книги 2",
            authors: "Автор 2",
            favorite: "Нет",
            fileCover: "cover2.jpg",
            fileName: "book2.pdf",
            fileBook: "2"
          }
    ]
};

router.get('/', (req, res) => {
    const {book} = library;
    res.json(book);
});

router.get('/:id', (req, res) => {
    const {book} = library;
    const {id} = req.params;
    const index = book.findIndex(el => el.id === id);

    if(index !== -1) {
        res.json(book[index]);
    } else {
        res.status(404);
        res.json('404');
    }
});

router.get('/:id/download', (req, res) => { 
    const { book } = library;
    const { id } = req.params;
    const bookItem = book.find(el => el.id === id);

    if (bookItem && bookItem.fileBook) {

        const filePath = `booksfilesuploads/${bookItem.fileBook}`;
        
        res.download(filePath, bookItem.fileName, (err) => {
            if (err) {
                res.status(500).json('Ошибка при скачивании файла');
            }
        });
    } else {
        res.status(404).json('Книга не найдена');
    }
});

router.post('/', fileUploadMulter.single('fileBook'), (req, res) => {
    const {book} = library;
    const {
        id, 
        title, 
        description, 
        authors, 
        favorite, 
        fileCover, 
        fileName,
        fileBook
    } = req.body;

    const newBook = new Book(
        id, 
        title, 
        description, 
        authors, 
        favorite, 
        fileCover, 
        fileName,
        fileBook
    );
    book.push(newBook);

    res.status(201);
    res.json(newBook);
});

router.put('/:id', (req, res) => {
    const {book} = library;
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body;
    const {id} = req.params;
    const index = book.findIndex(el => el.id === id);

    if(index !== -1) {
        book[index] = {
            ...book[index],
            title, 
            description, 
            authors, 
            favorite, 
            fileCover, 
            fileName,
            fileBook
        }
        res.json(book[index])
    } else {
        res.status(404);
        res.json('404 | Record not found');
    }
});

router.delete('/:id', (req, res) => {
    const {book} = library;
    const {id} = req.params;
    const index = book.findIndex(el => el.id === id);

    if(index !== -1) {
        book.splice(index, 1);
        res.json('ok')
    } else {
        res.status(404);
        res.json('404 | Book not found')
    }
});

module.exports = router; 