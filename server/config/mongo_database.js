const mongoose = require('mongoose');

const connectMongoDB = async() => {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${connection.connection.host}`);
}

module.exports = connectMongoDB;