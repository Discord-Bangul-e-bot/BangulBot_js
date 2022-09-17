import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Cat from './entity/Cat';
import Channel from './entity/Channel';
import Message from './entity/Message';
import Relation from './entity/Relation';
import User from './entity/User';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'honeycombpizza.link',
	port: 3306,
	username: 'discordjs',
	password: 'discordjs',
	database: 'discordjs',
	synchronize: true,
	logging: false,
	entities: [Cat, Channel, User, Relation, Message],
	migrations: [],
	subscribers: [],
});
