import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();
// const CONNECTION_URL = "mongodb+srv://keerthana:keerthana@cluster0.6e3dm.mongodb.net/?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('APP IS RUNNING')
})
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log('Server running on port 5000')))
    .catch((error) => console.log(error.message));

app.use('/posts', postRoutes);
app.use('/user', userRoutes);