const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
connectDB();

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's address
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('E-XOR NEWS API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
