import Discord from 'discord.js';
import Cat from 'src/backend/entity/Cat';
import Channel from 'src/backend/entity/Channel';
import Message from 'src/backend/entity/Message';
import Relation from 'src/backend/entity/Relation';
import User from 'src/backend/entity/User';
import CatRepository from 'src/backend/repository/CatRepository';
import InventoryRepository from 'src/backend/repository/InventoryRepository';
import ItemRepository from 'src/backend/repository/ItemRepository';
import { InteractionCreateDTO } from 'src/bot/InteractionService';
import Formatter from 'src/bot/util/formatter';

class MarketService {
	formatter: typeof Formatter = Formatter;
	cat: Cat;
	channel: Channel;
	user: User;
	relation: Relation;
	message?: Message;
	interaction: Discord.Interaction;

	constructor(args: InteractionCreateDTO) {
		this.user = args.user;
		this.cat = args.cat;
		this.channel = args.channel;
		this.relation = args.relation;
		this.message = args.message;
	}

	async openStore() {
		const items = await ItemRepository.getItems();
		return items;
	}

	async myItems() {
		return InventoryRepository.findAll(this.user);
	}

	async findItem(name: string) {
		return InventoryRepository.findItem(this.user, name);
	}

	async buyItem(name: string) {
		const itemRepo = await ItemRepository.buyItem(name, this.user);
		if (!itemRepo) {
			return false;
		}
		return true;
	}

	async useItem(itemRepo: InventoryRepository) {
		const funny = itemRepo.getFunny();
		const hungry = itemRepo.getHungry();
		const intimacy = itemRepo.getIntimacy();
		if (!this.cat.setHungryAvailable(hungry)) {
			return false;
		}

		await itemRepo.useItem();
		await this.cat.increaseFunny(itemRepo.getFunny());
		await this.cat.increaseHungry(itemRepo.getHungry());
		await this.relation.increaseIntimacy(itemRepo.getIntimacy());

		return true;
	}
}

export default MarketService;
