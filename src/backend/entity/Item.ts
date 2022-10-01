import BaseModel from 'src/backend/entity/BaseModel';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import Inventory from 'src/backend/entity/Inventory';

export enum ItemType {
	EDIBLE,
	PLAYABLE,
}

@Entity()
class Item extends BaseModel {
	@Column()
	price: number;

	@Column()
	intimacy: number;

	@Column()
	funny: number;

	@Column()
	hungry: number;

	@Column()
	type: ItemType;

	@Column({ default: 1 })
	amount: number = 1;

	@Column({ default: 1 })
	durability: number = 1;

	@OneToMany((type) => Inventory, (inventory) => inventory.item, { cascade: true })
	inventory: Inventory[];
}

export default Item;
