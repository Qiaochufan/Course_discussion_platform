require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/dbConnect');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});