import express from "express";
import bodyParser from "body-parser";
import db from "./db.js"

const app = express();
const port = 4546;
const dbInstance = new db();

app.use(bodyParser.json());

app.get('/customers', (req, res) => {
    dbInstance.getAll("customers").then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.send(500, `Process ended with error: ${err}`)
    });
});

app.get('/customers/:id', (req, res) => {
    dbInstance.getById( "customers", req.params.id,).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.send(500, `Process ended with error: ${err}`)
    });
});

app.put('/customers', (req, res) => {
    if (req.body.firstName && req.body.secondName && req.body.age) {
        const newCustomer = {
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            age: req.body.age,
        };
        dbInstance.update("customers", req.query.id, newCustomer).then(result => {
            res.status(200).send(result);
        }).catch(err => {
            res.send(500, `The customer info updating process ended with error: ${err}`)
        });
    } else {
        res.send(400, `The customer supposed to have first name, last name and age`)
    }

});

app.delete('/customers/:id', (req, res) => {
    dbInstance.deleteById("customers", req.params.id).then(obj => {
        res.status(200).send(obj.result.n + " document(s) deleted");
    }).catch(err => {
        res.send(500, `The customer info removal process ended with error: ${err}`)
    });
});

app.post("/customers", (req, res) => {
    if (req.body.firstName && req.body.secondName && req.body.age) {
        const newCustomer = {
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            age: req.body.age,
        };
        dbInstance.insertOne("customers", newCustomer).then(result => {
            res.status(200).send(result.ops);
        }).catch(err => {
            res.send(500, `The customer info updating process ended with error: ${err}`)
        })
    } else {
        res.send(400, `The customer supposed to have first name, last name and age`)
    }
});

app.listen(port, () => {
    console.log(`Up and Running on ${port} port`);
});