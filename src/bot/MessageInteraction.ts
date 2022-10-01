import Discord from 'discord.js';
import User from 'src/backend/entity/User';
import Message from 'src/backend/entity/Message';
import client from 'src/bot/client';
import InteractionRepository from 'src/bot/InteractionService';

/**
 *
 * @param command
 * @returns command+보기 , command+열기
 */
function openCommand(command: string) {
	return (target: string) => {
		return ['보기', '열기'].map((str) => target + str).includes(command);
	};
}

function buyCommand(command: string) {
	return (target: string) => {
		return ['사기', '구매'].map((str) => target + str).includes(command);
	};
}

function giveCommand(command: string) {
	return (target: string) => {
		return ['하기', '주기'].map((str) => target + str).includes(command);
	};
}

const MessageInteraction = async (message: Discord.Message) => {
	const service = await InteractionRepository.builderFromMessage(message);
	console.log(service.relation.getIntimacy());
	const { command, ...msgCommand } = client.getCommandFromMessage(message, service);
	const openCmd = openCommand(command);
	const buyCmd = buyCommand(command);
	const giveCmd = giveCommand(command);

	if (!msgCommand.acceptable) return;

	if (giveCmd('선물')) {
		for (const itemName of msgCommand.arguments) {
			const item = await service.marketService.findItem(itemName);
			if (!item) return;
		}
		return;
	}

	if (openCmd('가방')) {
		const items = await service.marketService.myItems();
		const itemsString = items.join(',');
		message.reply(itemsString);
		return;
	}
	if (openCmd('상점')) {
		const items = await service.marketService.openStore();
		message.reply(items.map((item) => item).join(','));
		return;
	}
	if (buyCmd('물건')) {
		const item = await service.marketService.buyItem(msgCommand.arguments[0]);
		if (item) {
			message.reply('물건이 구맸다옹');
		} else {
			message.reply('당신은 돈이없다옹');
		}
		return;
	}
	if (command === '야옹해봐') {
		const reply = '에옹?';
		const formattedReply = new service.formatter(reply).italic().toString();
		message.channel.send(formattedReply);
		return;
	}

	if (command == '야옹해봐') {
		message.channel.send('에옹?');
		return;
	}
	if (command === '츄르주기') {
		const result = await service.giveChurr();
		const formattedReply = new service.formatter(result.message).bold().toString();

		message.reply(formattedReply);
		return;
	}

	if (command === '손') {
		const result = service.askGiveHand();
		const formattedReply = new service.formatter(result.message).quote().toString();

		message.reply(formattedReply);
		return;
	}

	if (command === '마크다운테스트') {
		const reply = '미애웅?';
		let formattedReply = '';

		switch (msgCommand.arguments[0]) {
			case 'bold':
				formattedReply = new service.formatter(reply).bold().toString();
				break;
			case 'italic':
				formattedReply = new service.formatter(reply).italic().toString();
				break;
			case 'strikethrough':
				formattedReply = new service.formatter(reply).strikethrough().toString();
				break;
			case 'underscore':
				formattedReply = new service.formatter(reply).underscore().toString();
				break;
			case 'spoiler':
				formattedReply = new service.formatter(reply).spoiler().toString();
				break;
			case 'quote':
				formattedReply = new service.formatter(reply).quote().toString();
				break;
			case 'blockquote':
				formattedReply = new service.formatter(reply).blockQuote().toString();
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
