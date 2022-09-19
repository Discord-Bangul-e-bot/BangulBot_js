import Discord from 'discord.js';
export type QueryBase = {
	id: string;
	name: string;
};

export type AuthorBase = {
	id: string;
	username: string;
};

export type MessageBase = {
	author?: Discord.User;
	channel: Discord.If<Discord.InGuild, Discord.GuildTextBasedChannel, Discord.TextBasedChannel>;
	guild: Discord.Guild;
	content: string;
};

export type DiscordInteraction<T> = InteractionType & {
	[K in keyof T]: T[K];
};
