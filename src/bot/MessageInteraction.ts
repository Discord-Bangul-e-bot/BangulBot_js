import Discord from 'discord.js';
import User from 'src/backend/entity/User';
import Message from 'src/backend/entity/Message';
import client from 'src/bot/client';
import InteractionRepository from 'src/bot/InteractionRepository';

const MessageInteraction = async (message: Discord.Message) => {
	const repository = await InteractionRepository.builderFromMessage(message);
	const command = client.getCommandFromMessage(message, repository);
	const msgCommand = command.command;

	console.table(command);
	message;
	if (!command.acceptable) return;

	if (msgCommand === '야옹해봐') {
		const reply = '에옹?';
		const formattedReply = new repository.formatter(reply).italic().toString();

		message.channel.send(formattedReply);
		return;
	}
	if (msgCommand === '츄르주기') {
		const result = await repository.giveChurr();
		const formattedReply = new repository.formatter(result.message).bold().toString();

		message.reply(formattedReply);
		return;
	}

	if (msgCommand.startsWith('마크다운테스트')) {
		const spiltedCommand = msgCommand.split(' ');
		const reply = '미애웅?';
		let formattedReply = '';

		switch (spiltedCommand[1]) {
			case 'bold':
				formattedReply = new repository.formatter(reply).bold().toString();
				break;
			case 'italic':
				formattedReply = new repository.formatter(reply).italic().toString();
				break;
			case 'strikethrough':
				formattedReply = new repository.formatter(reply).strikethrough().toString();
				break;
			case 'underscore':
				formattedReply = new repository.formatter(reply).underscore().toString();
				break;
			case 'spoiler':
				formattedReply = new repository.formatter(reply).spoiler().toString();
				break;
			case 'quote':
				formattedReply = new repository.formatter(reply).quote().toString();
				break;
			case 'blockquote':
				formattedReply = new repository.formatter(reply).blockQuote().toString();
				break;
			default:
				formattedReply = '씨룬데?';
				break;
		}

		message.reply(formattedReply);
		return;
	}

	message.reply('야옹');
	return;
};

export default MessageInteraction;
