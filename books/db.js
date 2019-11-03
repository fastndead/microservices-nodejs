import MongoDB from "mongodb";

export default class db {
    constructor() {
        this.uri = process.env.MONGODB_URI || "mongodb+srv://admin:qwe123@pet-project-lxbpx.mongodb.net/books?retryWrites=true&w=majority";
        this.client = MongoDB.MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true});
        this.dbName = "books";
        this.dbConnection = this.client.connect();

        this.dbConnection.then(() => {
            console.log("Database is connected")
        }).catch(err => {
            console.error(`Database is NOT connected. error: ${err}`);
        });
    }

    async getAll(collection) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName)
            return db
                .collection(collection)
                .find({}, {projection: {_id: 0}})
                .toArray();
        });
    }

    async getById(id, collection) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName)
            return db
                .collection(collection)
                .findOne({"id": id}, {projection: {_id: 0}});
        });
    }

    async getAmount(amount, collection) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .find({}, {projection: {_id: 0}})
                .limit(Number(amount))
                .toArray();
        });
    }

    async insertOne(collection, objToInsert) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName)
            return db
                .collection(collection)
                .insertOne(objToInsert);
        });
    }

    async insert(collection, array) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .insertMany(array);
        });
    }

    async deleteById(collection, id) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .deleteOne({_id: id});
        });
    }

    async update(collection, id, doc) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .replaceOne({_id: id}, doc);
        });
    }
}
