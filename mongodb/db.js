const { MongoClient} = require('mongodb')

let db_collection
const uri = 'mongodb+srv://samuelsvob_db_user:0reYxd7lErG6t6pe@bookstore.p0cdh9m.mongodb.net/?appName=Bookstore'

module.exports = {
    connect_to_db: (call_back) => {
        MongoClient.connect(uri)
        .then((client) => {
            db_collection = client.db('bookstore')
            return call_back()
        })
        .catch(err => {
            console.log(err)
            return call_back(err)
        })
    },
    get_db: () => db_collection
}

