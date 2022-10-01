import BaseModel from 'src/backend/entity/BaseModel';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import User from 'src/backend/entity/User';
import Item from 'src/backend/entity/Item';

@Entity()
class Inventory extends BaseModel {
	@Column({ default: 'inventory' })
	name: string;

	@ManyToOne((type) => User, (user) => user.inventory, { onDelete: 'CASCADE', eager: true, nullable: false })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne((type) => Item, (item) => item.inventory, { onDelete: 'CASCADE', eager: true, nullable: false })
	@JoinColumn({ name: 'item_id' })
	item: Item;

	@Column()
	durability: number;

	setDurabilityAvailable(amount: number) {
		const target = this.durability + amount;
		if (0 > target) {
			return false;
		}
		return true;
	}

	async setDurability(amount: number = 1) {
		this.durability += amount;
		return this.save();
	}

	async increaseDurability(amount: number = 1) {
		if (!this.setDurabilityAvailable(amount)) {
			return false;
		}
		await this.setDurability(amount);
		return true;
	}

	async decreaseDurability(amount: number = 1) {
		if (!this.setDurabilityAvailable(-amount)) {
			return false;
		}
		await this.setDurability(-amount);
		await this.destroy();
		return true;
	}

	async destroy() {
		if (this.durability === 0) {
			return this.remove();
		}
		return this;
	}
}

export default Inventory;

class MyString extends String {
	tell() {
		return this;
	}
}
