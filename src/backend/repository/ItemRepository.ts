import Item from 'src/backend/entity/Item';
import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';
import Inventory from '../entity/Inventory';
import User from '../entity/User';
import InventoryRepository from './InventoryRepository';
import UserRepository from './UserRepository';

class ItemRepository extends BaseRepository<Item> {
	model: Item;

	constructor(model: Item) {
		super(model);
	}

	static async getItems() {
		const items = await Item.find();
		return items.map((item) => new ItemRepository(item));
	}

	static async findItem(name: string) {
		const item = await Item.findOneBy({ name });
		if (item) {
			return new ItemRepository(item);
		} else {
			return false;
		}
	}

	static async buyItem(name: string, user: User) {
		const itemRepo = await ItemRepository.findItem(name);
		const userRepo = new UserRepository(user);
		if (!itemRepo) {
			return itemRepo;
		} else {
			if (userRepo.hasCoin(itemRepo.model.price)) {
				await userRepo.decreaseCoin(itemRepo.model.price);
				const inventoryRepo = await InventoryRepository.createItem(itemRepo.model, userRepo.model);
			}
		}
		return true;
	}

	toString() {
		return `${this.model.name} : ${this.model.price}원`;
	}
}

export default ItemRepository;
