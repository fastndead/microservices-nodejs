import MongoDB from "mongodb";

export default class db {
    constructor() {
        this.uri = process.env.MONGODB_URI || "mongodb+srv://admin:qwe123@pet-project-lxbpx.mongodb.net/books?retryWrites=true&w=majority";
        this.client = MongoDB.MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true});
        this.dbName = "customers";
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
                .find({})
                .toArray();
        });
    }

    async getById(collection, id) {
        const ObjectId = MongoDB.ObjectId;
        id = ObjectId(id);
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName)
            return db
                .collection(collection)
                .findOne({_id: id});
        });
    }

    async getAmount(collection, amount) {
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .find({})
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
        const ObjectId = MongoDB.ObjectId;
        id = ObjectId(id);
        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .deleteOne({_id: id});
        });
    }

    async update(collection, id, doc) {
        if (!MongoDB.ObjectId.isValid(doc.customerId)) {
            throw "customer id is not valid"
        }
        if(!MongoDB.ObjectId.isValid(doc.bookId)){
            throw "book id is not valid"
        }

        return this.dbConnection.then(client => {
            const db = client.db(this.dbName);
            return db
                .collection(collection)
                .replaceOne({_id: id}, doc);
        });
    }
}
