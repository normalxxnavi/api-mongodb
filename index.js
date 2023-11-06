import { MongoClient } from 'mongodb' // Documentación CRUD: https://mongodb.github.io/node-mongodb-native/6.2/
import express, { request, response } from "express"

const app = express()
app.use(express.json())  // IMPORTANTE: SOPORTE PARA JSON


const DB_URL = process.env.MONGODB_URI ?? 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME ?? 'api'
const COLLECTION = 'users'
const PORT = process.env.PORT ?? 3000

let mongoClient = null
let database = null

// Si tenemos conexión anterior, la reutilizamos
async function connectToDatabase() {
    try {
        if (mongoClient && database) {
            return { mongoClient, database };
        }
        mongoClient = await (new MongoClient(DB_URL)).connect();
        database = await mongoClient.db(DB_NAME);
        return { mongoClient, database };
    } catch (e) {
        console.error(e);
    }
}


app.get("/", (request, response) => {
    response.redirect("/api/users")
})


// GET
app.get('/api/users', async (request, response) => {
    const { database } = await connectToDatabase();
    const collection = database.collection(COLLECTION);

    const results = await collection.find({}).toArray()

    response.status(200).json(results)
})

// POST 
app.post('/api/users', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const { database } = await connectToDatabase();
    const collection = database.collection(COLLECTION);

    const { nombre, edad } = request.body
    const results = await collection.insertOne({ nombre, edad });

    return response.status(200).json(results)
})

// GET 
app.get('/api/users/:id', async (request, response) => {
    const { database } = await connectToDatabase();
    const collection = database.collection(COLLECTION);

    const { id } = request.params
    const results = await collection.find({ _id: id }).toArray()

    response.status(200).json(results)
})

// PUT
app.put('/api/users/:id', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const { database } = await connectToDatabase();
    const collection = database.collection(COLLECTION);

    const { id } = request.params
    const { nombre, edad } = request.body
    const results = await collection.updateOne({ _id: id }, { $set: { nombre, edad } });

    response.status(200).json(results)
})

// DELETE
app.delete('/api/users/:id', async (request, response) => {
    const { database } = await connectToDatabase();
    const collection = database.collection(COLLECTION);

    const { id } = request.params
    const results = await collection.deleteOne({ _id: id }).toArray()
    response.status(200).json(results)
})


app.listen(PORT, () => console.log(`Servidor web iniciado en puerto ${PORT}`))

