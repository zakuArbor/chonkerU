
let user  = process.env.MONGO_USER || 'username';
let password=  process.env.MONGO_PASSWORD || 'password';
let host = process.env.MONGO_HOST || 'host';

const config = {
	db: {
		host: host,
		user: user,
		password: password,
	}
};

module.exports = config;
