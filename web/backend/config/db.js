const mongoose = require('mongoose');
const config = require('config');
const db = config.get('db');
const {db: {host, user, password} } = config

const connectDB = async () => {
  const connectionString = `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(connectionString);
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
