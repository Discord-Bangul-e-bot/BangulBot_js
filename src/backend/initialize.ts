import Item, { ItemType } from 'src/backend/entity/Item';

const find = async (name: string): Promise<number> => {
	const res = await Item.findAndCountBy({ name });
	return res[1];
};

const initialize = async () => {
	if ((await find('츄르')) == 0) {
		const item = Item.create({
			name: '츄르',
			price: 10,
			funny: 2,
			hungry: 10,
			intimacy: 2,
			type: ItemType.EDIBLE,
		});
		item.save().then(console.log);
	}
	if ((await find('참치캔')) == 0) {
		Item.create({
			name: '참치캔',
			price: 50,
			funny: 5,
			hungry: 50,
			intimacy: 5,
			type: ItemType.EDIBLE,
		}).save();
	}
	if ((await find('열빙어트릿')) == 0) {
		Item.create({
			name: '열빙어트릿',
			price: 5,
			funny: 1,
			hungry: 5,
			intimacy: 1,
			type: ItemType.EDIBLE,
		}).save();
	}
	if ((await find('낚싯대장난감')) == 0) {
		Item.create({
			name: '낚싯대장난감',
			price: 100,
			funny: 10,
			hungry: -5,
			durability: 10,
			intimacy: 2,
			type: ItemType.EDIBLE,
		}).save();
	}
	if ((await find('캣휠')) == 0) {
		Item.create({
			name: '캣휠',
			price: 1000,
			funny: 20,
			hungry: -10,
			durability: 20,
			intimacy: 10,
			type: ItemType.EDIBLE,
		}).save();
	}
	if ((await find('쥑쥑이')) == 0) {
		Item.create({
			name: '쥑쥑이',
			price: 200,
			funny: 10,
			hungry: -2,
			durability: 20,
			intimacy: 1,
			type: ItemType.EDIBLE,
		}).save();
	}
};

export default initialize;
