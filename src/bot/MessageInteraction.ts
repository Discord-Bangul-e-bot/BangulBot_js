import Discord from 'discord.js';
import User from 'src/backend/entity/User';
import Message from 'src/backend/entity/Message';
import client from 'src/bot/client';
import InteractionRepository from 'src/bot/InteractionRepository';

const MessageInteraction = async (message: Discord.Message) => {
	const repository = await InteractionRepository.builderFromMessage(message);
	const command = client.getCommandFromMessage(message, repository);
	console.table(command);
	message;
	if (!command.acceptable) return;

	if (command.command == '야옹해봐') {
		message.channel.send('에옹?');
		return;
	}
	if (command.command == '츄르주기') {
		const result = await repository.giveChurr();
		message.reply(result.message);
		return;
	}
	message.reply('야옹');
};

export default MessageInteraction;
