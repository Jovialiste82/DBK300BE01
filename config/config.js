export const config = {
  APP_PORT: process.env.APP_PORT || 6000,
  IO_PORT: process.env.IO_PORT || 6002,
  DB_URI: process.env.DB_URI,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DB_CLUSTER: process.env.MONGO_DB_CLUSTER,
  MONGO_DB_DEV: process.env.MONGO_DB_DEV,
  JWT_SECRET: process.env.JWT_SECRET,
};
