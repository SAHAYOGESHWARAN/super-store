const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Log MONGO_URI to verify it's loaded correctly
console.log('MongoDB URI:', process.env.MONGO_URI);

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // Exit the process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
