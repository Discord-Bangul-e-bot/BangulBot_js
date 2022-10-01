import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Cat from 'src/backend/entity/Cat';
import Channel from 'src/backend/entity/Channel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST,
	port: 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [Cat, Channel, User, Relation, Message],
	migrations: [],
	subscribers: [],
});
