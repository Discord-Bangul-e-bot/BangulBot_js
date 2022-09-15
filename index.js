// const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// PARAM token
const { token } = process.env.DISCORD_TOKEN;

// PARAM discord client
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// FUNCTION discord 봇이 실행시 실행
client.once('ready', () => {
	console.log('MEOW');
});

// FUNCTION login
client.login(token);

client.on('message', message => {
	console.log(message.content);
});