import { MongoClient, ObjectId } from 'mongodb' // Documentación CRUD: https://mongodb.github.io/node-mongodb-native/6.2/
import express from "express"

const app = express()
app.use(express.json())  // IMPORTANTE: SOPORTE PARA JSON


const PORT = process.env.PORT ?? 3000
const DB_URL = process.env.MONGODB_URI ?? 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME ?? 'api'
const COLLECTION = 'productos'

const client = new MongoClient(DB_URL)

app.get("/", (request, response) => {
    response.redirect("/api/productos")
})


// GET
app.get('/api/productos', async (request, response) => {
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION);

    const results = await collection.find({}).toArray()

    response.status(200).json(results)
})

// POST 
app.post('/api/productos', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION);

    const { nombre, precio, categoria } = request.body
    const results = await collection.insertOne({ nombre, precio, categoria });

    return response.status(200).json(results)
})

// GET 
app.get('/api/productos/:id', async (request, response) => {
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION);

    const { id } = request.params
    const results = await collection.find({ _id: new ObjectId(id) }).toArray()

    response.status(200).json(results)
})

// PUT
app.put('/api/productos/:id', async (request, response) => {
    if (!request.is('json'))
        return response.json({ message: 'Debes proporcionar datos JSON' })

    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION);

    const { id } = request.params
    const { nombre, precio, categoria } = request.body
    const results = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { nombre, precio, categoria } });

    response.status(200).json(results)
})

// DELETE
app.delete('/api/productos/:id', async (request, response) => {
    const database =  client.db(DB_NAME);
    const collection = database.collection(COLLECTION);

    const { id } = request.params
    const results = await collection.deleteOne({ _id: new ObjectId(id) })
    response.status(200).json(results)
})


app.listen(PORT, () => console.log(`Puerto ${PORT}`))

