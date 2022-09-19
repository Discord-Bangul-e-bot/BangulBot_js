import Discord from 'discord.js';
import User from 'src/backend/entity/User';
import Message from 'src/backend/entity/Message';
import client from 'src/bot/client';
import Interaction from 'src/bot/Interaction';

const MessageInteraction = async (message: Discord.Message) => {
	const interaction = await Interaction.builderFromMessage(message);
	const command = client.getCommandFromMessage(message, interaction);
	console.table(command);
	if (!command.acceptable) return;

	if (command.command == '야옹해봐') {
		message.channel.send('에옹?');
		return;
	}
	if (command.command == '츄르주기') {
		const result = await interaction.giveChurr();
		message.reply(result.message);
		return;
	}
	message.reply('야옹');
};

export default MessageInteraction;
