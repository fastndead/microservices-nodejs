import MongoDB from "mongodb";

const uri = "mongodb+srv://admin:qwerty123456789@cluster0-ivhai.mongodb.net/test?retryWrites=true&w=majority";
const client = MongoDB.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

export default class db {
    constructor() {
        this.dbName = "orders";
        this.dbPromise = this.getDbPromise();
    }

    async getDbPromise() {
        if (!client.isConnected()) {
            return await client.connect().then(res => {
                console.log(`DB is connected!`);
                return client.db(this.dbName)
            }).catch(err => {
                console.log(`DB is NOT connected. Error: ${err}`);
            });
        }
        return client.db(this.dbName);
    }

    async getAll(collection) {
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .find({})
                .toArray();
        });
    }

    async getById(collection, id) {
        const ObjectId = MongoDB.ObjectId;
        id = ObjectId(id);
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .findOne({_id: id});
        });
    }

    async getAmount(collection, amount) {
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .find({})
                .limit(Number(amount))
                .toArray();
        });
    }

    async insertOne(collection, objToInsert) {
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .insertOne(objToInsert);
        });
    }

    async insert(collection, array) {
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .insertMany(array);
        });
    }

    async deleteById(collection, id) {
        const ObjectId = MongoDB.ObjectId;
        id = ObjectId(id);
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .deleteOne({_id: id});
        });
    }

    async update(collection, id, doc) {
        const ObjectId = MongoDB.ObjectId;
        id = ObjectId(id);
        return this.dbPromise.then(db => {
            return db
                .collection(collection)
                .replaceOne({_id: id}, doc);
        });
    }
}
