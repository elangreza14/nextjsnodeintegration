const appName = "tiga";
const serverPort = process.env.CUSTOM_PORT || 3122;

const completeConfig = {
  default: {
    appName,
    serverPort,
    databaseUrl: process.env.MONGO_URI,
    secret_key: process.env.JWT_SECRET_LOGIN,
  },

  development: {
    serverPort,
    databaseUrl: process.env.MONGO_URI,
    secret_key: process.env.JWT_SECRET_LOGIN,
  },

  production: {
    serverPort,
    databaseUrl: process.env.MONGO_URI,
    secret_key: process.env.JWT_SECRET_LOGIN,
  },
};

module.exports = {
  completeConfig,
};
