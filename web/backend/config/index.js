var config = {};

let user  = process.env.MONGO_USER || 'username';
let password=  process.env.MONGO_PASSWORD || 'password';
let host = process.MONGO_HOST || 'host';
config.mongoURI = "mongodb+srv://" + user + ":" + password + "@" + host + "/?retryWrites=true&w=majority";

module.exports = config;
