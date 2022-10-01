import Discord from 'discord.js';
import Cat from 'src/backend/entity/Cat';
import Channel from 'src/backend/entity/Channel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';
import CatRepository from 'src/backend/repository/CatRepository';
import ChannelRepository from 'src/backend/repository/ChannelRepository';
import RelationRepository from 'src/backend/repository/RelationRepository';
import UserRepository from 'src/backend/repository/UserRepository';
import { MessageBase } from 'src/backend/types';
import MarketService from 'src/bot/services/MarketService';
import Formatter from 'src/bot/util/formatter';
import { CHURRPRICE } from 'src/const';

export type InteractionCreateDTO = {
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

class InteractionService {
	formatter: typeof Formatter = Formatter;
	cat: CatRepository;
	channel: ChannelRepository;
	user: UserRepository;
	relation: RelationRepository;
	message?: Message;
	interaction: Discord.Interaction;
	marketService: MarketService;

	constructor(args: InteractionCreateDTO) {
		this.user = new UserRepository(args.user);
		this.cat = new CatRepository(args.cat);
		this.channel = new ChannelRepository(args.channel);
		this.relation = new RelationRepository(args.relation);
		this.message = args.message;
		this.marketService = new MarketService(args);
	}

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
			return { ...giveChurrResult, message: `${this.cat.getName()}은(는) 배가 고프지 않아요` };
		}
		if (!this.user.setCoinAvailable(-totalPrice)) {
			return { ...giveChurrResult, message: `${Math.abs(insufficient)}만큼 코인이 부족해요!` };
		}
		if (!this.relation.setIntimacyAvailable(amount)) {
			return { ...giveChurrResult, message: '???' };
		}
		await this.user.decreaseCoin(totalPrice);
		await this.cat.increaseHungry(amount);
		await this.relation.increaseIntimacy(amount);
		return { ...giveChurrResult, message: `${this.cat.getName()}은 츄르를 맛있게 먹었어요` };
	}

	askGiveHand() {
		const probality = Math.floor(Math.random() * 101);
		let result = {
			probality: probality,
			relation: this.relation,
			message: '',
		};

		if (probality < 50) {
			result = { ...result, message: `${this.cat.getName()}는(은) 외면중이다..` };
		} else if (probality < 75) {
			result = { ...result, message: `${this.cat.getName()}(이)가 오른발을 올려줬다.` };
		} else {
			result = { ...result, message: `${this.cat.getName()}(이)가 왼발을 올려줬다.` };
		}
		return result;
	}

	static builderFromInteraction(interaction: Discord.Interaction) {
		const guild = interaction.guild;
		const channel = interaction.channel;
		return InteractionService.builderFromMessage({ guild, channel, author: interaction.user, content: '' });
	}

	static builderFromMessage(_message: MessageBase) {
		return new Promise<InteractionService>(async (resolve, reject) => {
			try {
				const cat = await CatRepository.getOrCreateFromMessage(_message);
				const catRepo = new CatRepository(cat);
				const user = await UserRepository.getOrCreateFromMessage(_message);
				await user.increaseCoin(1);
				const channel = await ChannelRepository.getOrCreateFromMessage(_message);
				const relation = await RelationRepository.getOrCreate({ user: user, cat: cat });
				let message: Message;
				if (_message.content) {
					message = await Message.createFromInteraction(_message);
				}
				const interaction = InteractionService.create({ user, cat: cat, channel, relation, message });

				resolve(interaction);
			} catch {
				reject();
			}
		});
	}

	private static create(arg: InteractionCreateDTO) {
		return new InteractionService(arg);
	}

	getCatName() {
		return this.cat.getName();
	}

	async setName(newName: string) {
		await this.cat.setName(newName);
		return this;
	}
}

export default InteractionService;
