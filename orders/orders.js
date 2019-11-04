import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import db from "./db.js"

const app = express();
const port = 4547;
const dbInstance = new db();

app.use(bodyParser.json());

app.get('/orders', (req, res) => {
    dbInstance.getAll("orders").then(result => {
        const promises = result.map(async order => {
            const promiseForCustomer = axios(`http://localhost:4546/customers/${order.customerId}`).then(result => {
                order.customer = result.data;
            });
            const promiseForBook = axios(`http://localhost:4545/books/${order.bookId}`).then(result => {
                order.book = result.data;
            });
            return Promise.all([promiseForBook, promiseForCustomer]).then(() => {
                order.customerId = undefined;
                order.bookId = undefined;
                return order;
            });
        });
        return Promise.all(promises);
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.send(500, `The order info creation process ended with error: ${err}`)
    });
});

app.get('/orders/:id', (req, res) => {
    dbInstance.getById("orders", req.params.id,).then(result => {
        const promiseForBook = axios(`http://localhost:4545/books/${result.bookId}`).then(bookResponse => {
            result.book = bookResponse.data
        });
        const promiseForCustomer = axios(`http://localhost:4546/customers/${result.customerId}`).then(customerResponse => {
            result.customer = customerResponse.data
        });
        return Promise.all([promiseForCustomer, promiseForBook]).then(() => {
            result.customerId = undefined;
            result.bookId = undefined;
            return result;
        });
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.send(500, `The order info creation process ended with error: ${err}`)
    });
});

app.put('/orders', (req, res) => {
    try {
        if (req.body.customerId && req.body.bookId) {
            const newOrder = {
                customerId: req.body.customerId,
                bookId: req.body.bookId,
            };
            dbInstance.update("orders", req.query.id, newOrder).then(result => {
                res.status(200).send(result.ops);
            }).catch(err => {
                res.send(500, `The order info updating process ended with error: ${err}`)
            })
        } else {
            res.send(400, `The order supposed to have ids of customer and book`)
        }
    } catch (e) {
        res.send(500, `The order info updating process ended with error: ${e}`)
    }
});

app.delete('/orders/:id', (req, res) => {
    dbInstance.deleteById("orders", req.params.id).then(obj => {
        res.status(200).send(obj.result.n + " document(s) deleted");
    }).catch(err => {
        res.send(500, `The order info removal process ended with error: ${err}`)
    });
});

app.post("/orders", (req, res) => {
    try {
        if (req.body.customerId && req.body.bookId) {
            const newOrder = {
                customerId: req.body.customerId,
                bookId: req.body.bookId,
            };
            dbInstance.insertOne("orders", newOrder).then(result => {
                res.status(200).send(result.ops);
            }).catch(err => {
                res.send(500, `The order info updating process ended with error: ${err}`)
            })
        } else {
            res.send(400, `The order supposed to have ids of customer and book`)
        }
    } catch (e) {
        res.send(500, `The order info updating process ended with error: ${e}`)
    }
});

app.listen(port, () => {
    console.log(`Up and Running on ${port} port`);
});



