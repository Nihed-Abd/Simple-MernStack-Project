const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Default fallback for local development if MONGO_URI is not set
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teamtask';
    
    // Replace 'localhost' with '127.0.0.1' to force IPv4
    if (mongoUri.includes('localhost')) {
      mongoUri = mongoUri.replace('localhost', '127.0.0.1');
      console.log(`Using IPv4 address: ${mongoUri}`.yellow);
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    console.log('Ensure that MongoDB is running and that the connection string is correct.'.yellow);
    process.exit(1);
  }
};

module.exports = connectDB;
