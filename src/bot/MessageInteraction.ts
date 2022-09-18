import Discord from 'discord.js';
import User from 'src/backend/entity/User';
import Message from 'src/backend/entity/Message';
import client from 'src/bot/client';

const MessageInteraction = async (message: Discord.Message) => {
	// NOTE: PREFIX를 커스텀으로 설정 할 수 있음
	const command = client.getCommandFromMessage(message);
	const user = await User.getOrCreateFromMessage(message);
	Message.createFromInteraction(message);

	if (!command.acceptable) return;

	if (command.command == '야옹해봐') {
		message.channel.send('에옹?');
		return;
	}
	message.reply('야옹');
};

export default MessageInteraction;
