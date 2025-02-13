import express from 'express'
import dotenv from 'dotenv'
dotenv.config();

import { connectDatabase } from './config/database';


const app = express();

app.use(express.json());

connectDatabase()
  .then(() => {
    console.log("Connected to database")
    app.listen(3000, () => {
      console.log("Server is running on port 3000")
    })
  })
  .catch((error) => console.log(error))