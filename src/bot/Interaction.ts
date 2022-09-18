import Discord from 'discord.js';
import Cat from 'src/backend/entity/Cat';
import Channel from 'src/backend/entity/Channel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';
import { MessageBase } from 'src/backend/types';
import MyClient from 'src/bot/MyClient';
import { CHURRPRICE } from 'src/const';

type InteractionCreateDTO = {
	cat: Cat;
	channel: Channel;
	user: User;
	relation: Relation;
	message?: Message;
};

type GiveChurrResult = {
	result: boolean;
	churrAmount: number;
	price: number;
	totalPrice: number;
	message: string;
	insufficient: number;
};

class Interaction {
	cat: Cat;
	channel: Channel;
	user: User;
	relation: Relation;
	message?: Message;
	interaction: Discord.Interaction;

	async giveChurr(amount: number = 1): Promise<GiveChurrResult> {
		const totalPrice = amount * CHURRPRICE;
		const insufficient = this.user.buyAvailable(totalPrice);
		const giveChurrResult: GiveChurrResult = {
			result: false,
			churrAmount: amount,
			price: CHURRPRICE,
			message: '',
			totalPrice,
			insufficient,
		};
		if (!this.cat.setHungryAvailable(-amount)) {
			return { ...giveChurrResult, message: `${this.cat.getName()}은(는) 배가고프지 않아요` };
		}
		if (!this.user.setCoinAvailable(-totalPrice)) {
			return { ...giveChurrResult, message: `${Math.abs(insufficient)}만큼 코인이 부족해요!` };
		}
		if (!this.relation.setIntimacyAvailable(amount)) {
			return { ...giveChurrResult, message: '???' };
		}
		await this.user.decreaseCoin(totalPrice);
		await this.cat.increaseHungry(amount);
		return { ...giveChurrResult, message: `${this.cat.getName()}은 츄르를 맛있게 먹었어요` };
	}

	static builderFromInteraction(interaction: Discord.Interaction) {
		const guild = interaction.guild;
		const channel = interaction.channel;
		return Interaction.builderFromMessage({ guild, channel, author: interaction.user, content: '' });
	}

	static builderFromMessage(_message: MessageBase) {
		return new Promise<Interaction>(async (resolve, reject) => {
			try {
				const cat = await Cat.getOrCreateFromMessage(_message);
				const user = await User.getOrCreateFromMessage(_message);
				await user.increaseCoin(1);
				const channel = await Channel.getOrCreateFromMessage(_message);
				const relation = await Relation.getRelation({ user: user, cat: cat });
				let message: Message;
				if (_message.content) {
					message = await Message.createFromInteraction(_message);
				}
				const interaction = Interaction.create({ user, cat, channel, relation, message });

				resolve(interaction);
			} catch {
				reject();
			}
		});
	}

	private static create({ user, cat, channel, relation, message }: InteractionCreateDTO) {
		const instance = new Interaction();
		instance.user = user;
		instance.cat = cat;
		instance.channel = channel;
		instance.relation = relation;
		instance.message = message;
		return instance;
	}

	getCatName() {
		return this.cat.getName();
	}

	async setName(newName: string) {
		await this.cat.setName(newName);
		return this;
	}
}

export default Interaction;
