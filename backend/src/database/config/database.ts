import 'dotenv/config';
import { Options, Dialect } from 'sequelize';

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, DB_DIALECT } =
  process.env;

const config: Options = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: DB_DIALECT as Dialect,
};

export = config;
