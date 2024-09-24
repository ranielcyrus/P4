import express from 'express';
import process from 'node:process';
import mongoose from 'mongoose';
import cors from 'cors';
import { Schema } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.set('port', PORT);

//middleware
app.use(express.json())
app.use(cors())

//mongodb link
const uri = process.env.DB_CONNECTION

//using mongoose to connect to db
mongoose.connect(uri)
  .then(() => console.log('mongoDB connected!'))
  .catch(err => console.error('mongoDB connection error')) 

//define schema
const dataSchema = new Schema({
   data_title: String,
   data_contents: String,
})

//model
const Data = mongoose.model('Data', dataSchema);

//read
app.get('/datas', async (req, res) => {
  try {
    const users = await Data.find()
    res.status(200).json({
      results: users
    });
  } catch (error) {
    res.status(500).json({
      message: 'internal server error'
    })
  }
});

//create
app.post('/data', async (req, res) => {

  try {
    const newUser = new Data(req.body)
    const insertNewUser = await newUser.save()

    res.status(201).json(insertNewUser)
  } catch (error) {
    res.status(400).json({
      message: 'bad request'
    })
  }
})

//delete
app.delete('/data/:id', async (req, res) => {

  try {
    const { id } = req.params
    const deletedUser = await Data.findByIdAndDelete(id);

    if(deletedUser) {
      res.status(204).json({
        message: 'User deleted successfully'
      })
    } else {
      res.status(404).json({
        message: 'User not found'
      })
    }
    
  } catch (error) {
    res.status(500).json({
      message: 'internal server error'
    })
  }
})

//update
app.patch('/data/:id', async (req, res) => {

  try {
    const { id } = req.params
    const toUpdateUser = req.body;
    const updatedUser = await Data.findByIdAndUpdate(id, toUpdateUser, { new: true });

    if(updatedUser) {
      res.status(201).json(updatedUser)
    } else {
      res.status(404).json({
        message: 'User not found'
      })
    }
    
  } catch (error) {
    res.status(500).json({
      message: 'internal server error'
    })
  }
})


app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});



