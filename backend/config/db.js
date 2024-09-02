const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const MONGODB_URI="mongodb://localhost:27017/muruganStore"

const connectDB = async () => {
  try {
    console.log("mongouri",MONGODB_URI)
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
