import Item from 'src/backend/entity/Item';
import BaseRepository, { RepositoryDecorator } from 'src/backend/repository';
import { BaseModelQueryParam, MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME } from 'src/const';
import Inventory from 'src/backend/entity/Inventory';
import User from 'src/backend/entity/User';
import ItemRepository from './ItemRepository';
import UserRepository from './UserRepository';

class InventoryRepository extends BaseRepository<Inventory> {
	model: Inventory;

	constructor(model: Inventory) {
		super(model);
	}

	getFunny() {
		return this.model.item.funny;
	}

	getHungry() {
		return this.model.item.hungry;
	}

	getIntimacy() {
		return this.model.item.intimacy;
	}

	static async findAll(user: User) {
		const items = await Inventory.findBy({
			user: {
				id: user.id,
			},
		});
		return items.map((item) => new InventoryRepository(item));
	}

	static async findItems(user: User, name: string) {
		const items = await Inventory.findBy({
			user: {
				id: user.id,
			},
			name,
		});
		return items.map((item) => new InventoryRepository(item));
	}

	static async findItem(user: User, name: string) {
		const items = await Inventory.findBy({
			user: {
				id: user.id,
			},
			name,
		});
		if (items.length === 0) {
			return false;
		}
		return new InventoryRepository(items[0]);
	}

	async useItem() {
		await this.model.decreaseDurability(1);
		return this;
	}

	static async createItem(item: Item, user: User) {
		const inventory = new Inventory();
		inventory.name = item.name;
		inventory.user = user;
		inventory.item = item;
		inventory.durability = item.durability;
		const instance = await inventory.save();
		return new InventoryRepository(instance);
	}

	toString() {
		return this.model.name;
	}
}

export default InventoryRepository;
