
let user  = process.env.MONGO_USER || 'username';
let password=  process.env.MONGO_PASSWORD || 'password';
let host = process.MONGO_HOST || 'host';

const config = {
	db: {
		host: host,
		user: user,
		password: passord,
	}
};

module.exports = config;
