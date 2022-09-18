import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Cat from 'src/backend/entity/Cat';
import Channel from 'src/backend/entity/Channel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'honeycombpizza.link',
	port: 3306,
	username: 'discordjs',
	password: 'discordjs',
	database: 'discordjstest',
	synchronize: true,
	logging: false,
	entities: [Cat, Channel, User, Relation, Message],
	migrations: [],
	subscribers: [],
});
