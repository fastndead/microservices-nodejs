import express from "express";
import bodyParser from "body-parser";
import db from "./db.js"

const app = express();
const port = 4545;
const dbInstance = new db();

app.use(bodyParser.json());

app.get('/books', (req, res) => {
    dbInstance.getAll("books").then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.send(500, `The book creation process ended with error: ${err}`)
    });
});

app.put('/books', (req, res) => {
    if (req.body.title && req.body.author) {
        const newBook = {
            title: req.body.title,
            author: req.body.author,
        };
        dbInstance.update("books", req.query.id, req.body).then(result => {
            res.status(200).send(result);
        }).catch(err => {
            res.send(500, `The book updating process ended with error: ${err}`)
        });
    } else {
        res.send(400, `The book suppose to have an author AND a name`)
    }

});

app.delete('/books', (req, res) => {
    dbInstance.deleteById("books", req.query.id).then(obj => {
        res.status(200).send(obj.result.n + " document(s) deleted");
    }).catch(err => {
        res.send(500, `The book removal process ended with error: ${err}`)
    });
});

app.post("/books", (req, res) => {
    if (req.body.title && req.body.author) {
        const newBook = {
            title: req.body.title,
            author: req.body.author,
        };
        dbInstance.insertOne("books", newBook).then(result => {
            res.status(200).send(result.ops);
        }).catch(err => {
            res.send(500, `The book updationg process ended with error: ${err}`)
        })
    } else {
        res.send(400, `The book suppose to have an author AND a name`)
    }
});

app.listen(port, () => {
    console.log(`Up and Running on ${port} port`);
});