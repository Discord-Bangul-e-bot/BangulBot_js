import Discord, { InteractionType } from 'discord.js';
import { BeforeInsert, Column, DeepPartial, Entity, FindOneOptions, OneToMany } from 'typeorm';
import BaseModel from 'src/backend/entity/BaseModel';
import Relation from 'src/backend/entity/Relation';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MessageBase } from 'src/backend/types';
import { DEFAULTCATNAME, FEELHUNGRY } from 'src/const';
@Entity()
class Cat extends BaseModel {
	@OneToMany((type) => Relation, (relation) => relation.cat)
	relations: Relation[];

	@Column()
	hungry: number;

	@Column({ default: DEFAULTCATNAME })
	name: string;

	@BeforeInsert()
	beforeInsertActions() {
		this.hungry = 0;
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
