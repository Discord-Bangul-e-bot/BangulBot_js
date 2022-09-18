import dotenv from 'dotenv';

import { SlashCommandBuilder, Routes } from 'discord.js';
import {REST} from "@discordjs/rest";

dotenv.config()
const clientId = process.env.CLIENT_ID;
const  guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// FUNCTION slash command builder
const makeCommand = (name: string, desc: string) => {
	const newCommand = new SlashCommandBuilder().setName(name).setDescription(desc);
	return newCommand;
};

// PARAM 명령어 등록
const commands = [
	makeCommand('meow', '고양이가 야옹을 해요'),
	makeCommand('stats', '서버 상태 명령어'),
	makeCommand('김한얼', '???'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data:any) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);