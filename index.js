const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    const taskCollection = client.db('TaskBar').collection('tasks')

    try {
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            console.log(task)
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = await taskCollection.find(query).toArray()
            res.send(cursor)
        })
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId }
            const cursor = await taskCollection.deleteOne(query)
            res.send(cursor)
        })
        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.taskDetails;
            const query = { _id: ObjectId(id) };
            const UpdatedDoc = {
                $set: {
                    taskDetails: status
                }
            }
            const result = await taskCollection.updateOne(query, UpdatedDoc)
            res.send(result)
        })
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.taskCompleted;
            const query = { _id: ObjectId(id) };
            const UpdatedDoc = {
                $set: {
                    completedTask: status
                }
            }
            const result = await taskCollection.updateOne(query, UpdatedDoc)
            res.send(result)
        })
        app.put('/tasks/comments/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.comment;
            console.log(status)
            const query = { _id: ObjectId(id) };
            const UpdatedDoc = {
                $set: {
                    comments: status
                }
            }
            const result = await taskCollection.updateOne(query, UpdatedDoc)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Task bar is running in ${port}`)
})