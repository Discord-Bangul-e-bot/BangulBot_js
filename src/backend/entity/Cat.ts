import BaseModel from 'src/backend/entity/BaseModel';
import Channel from 'src/backend/entity/Channel';
import Relation from 'src/backend/entity/Relation';
import CatRepository from 'src/backend/repository/CatRepository';
import { DEFAULTCATNAME, FEELHUNGRY } from 'src/const';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity()
class Cat extends BaseModel {
	repository: CatRepository;
	@OneToMany((type) => Relation, (relation) => relation.cat)
	relations: Relation[];

	@Column()
	hungry: number;

	@Column({ default: DEFAULTCATNAME })
	name: string;

	@OneToMany((type) => Channel, (channel) => channel.cat, { cascade: true, eager: true })
	@JoinColumn()
	channels: Channel[];

	@BeforeInsert()
	beforeInsertActions() {
		this.hungry = 0;
	}

	constructor() {
		super();
		this.repository = new CatRepository(this);
	}

	isHungry() {
		return this.hungry >= FEELHUNGRY ? true : false;
	}

	async increaseHungry(amount = 1) {
		if (!this.setHungryAvailable(amount)) {
			return false;
		}
		await this.setHungry(amount);
		return true;
	}

	async decreaseHungry(amount = 1) {
		if (!this.setHungryAvailable(-amount)) {
			return false;
		}
		await this.setHungry(-amount);
		return true;
	}

	setHungryAvailable(amount: number) {
		const target = this.hungry + amount;
		if (0 > target || target > 100) {
			return false;
		} else {
			return true;
		}
	}

	private async setHungry(amount: number) {
		this.hungry += amount;
		await this.save();
	}

	setName(newName: string) {
		this.name = newName;
		return this.save();
	}
	getName() {
		return this.name;
	}
}

export default Cat;
